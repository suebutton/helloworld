Production configuration for Kokiri. See ../modules/README.md for details.

# Import

Existing resources were imported using the following commands:

```
terraform import module.kokiri_production.google_bigquery_table.kokiri btn-dlc:production.kokiri
terraform import aws_elasticache_replication_group.kokiri kokiri-prod
```
