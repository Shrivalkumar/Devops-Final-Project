def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "UP"}


def test_readiness_uses_database(client):
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "READY"}


def test_create_and_get_deployment(client, deployment_payload):
    created = client.post("/api/deployments", json=deployment_payload)
    assert created.status_code == 201
    deployment_id = created.json()["id"]
    fetched = client.get(f"/api/deployments/{deployment_id}")
    assert fetched.status_code == 200
    assert fetched.json()["service_name"] == "payments-api"


def test_list_deployments(client, deployment_payload):
    client.post("/api/deployments", json=deployment_payload)
    response = client.get("/api/deployments")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_update_deployment_status(client, deployment_payload):
    deployment_id = client.post("/api/deployments", json=deployment_payload).json()["id"]
    response = client.put(f"/api/deployments/{deployment_id}", json={"status": "SUCCEEDED"})
    assert response.status_code == 200
    assert response.json()["status"] == "SUCCEEDED"


def test_delete_deployment(client, deployment_payload):
    deployment_id = client.post("/api/deployments", json=deployment_payload).json()["id"]
    response = client.delete(f"/api/deployments/{deployment_id}")
    assert response.status_code == 204
    assert client.get(f"/api/deployments/{deployment_id}").status_code == 404


def test_rejects_invalid_environment(client, deployment_payload):
    deployment_payload["environment"] = "LOCAL"
    response = client.post("/api/deployments", json=deployment_payload)
    assert response.status_code == 422


def test_stats_group_by_status(client, deployment_payload):
    client.post("/api/deployments", json=deployment_payload)
    second = {**deployment_payload, "service_name": "web-portal", "version": "v3.1.7", "status": "SUCCEEDED"}
    client.post("/api/deployments", json=second)
    response = client.get("/api/deployments/stats")
    assert response.status_code == 200
    assert response.json() == {"total": 2, "planned": 1, "running": 0, "succeeded": 1, "failed": 0}


def test_metrics_are_prometheus_formatted(client):
    client.get("/health")
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "http_requests_total" in response.text
