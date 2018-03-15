Staging configuration for Kokiri. See ../modules/README.md for details.

# Import

Existing resources were imported using the following commands:

```
terraform import module.kokiri_staging.google_bigquery_table.kokiri btn-dlc:staging.kokiri
terraform import module.kokiri_staging.google_bigquery_table.kokiri_7d btn-dlc:staging.kokiri_7d
terraform import aws_elasticache_cluster.kokiri kokiri-staging
```
