from alembic import op
import sqlalchemy as sa

revision = "0001_create_deployments"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "deployments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("service_name", sa.String(length=120), nullable=False),
        sa.Column("version", sa.String(length=80), nullable=False),
        sa.Column("environment", sa.String(length=20), nullable=False, server_default="STAGING"),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="PLANNED"),
        sa.Column("risk", sa.String(length=20), nullable=False, server_default="MEDIUM"),
        sa.Column("owner", sa.String(length=120), nullable=False, server_default="Platform team"),
        sa.Column("change_summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

def downgrade():
    op.drop_table("deployments")
