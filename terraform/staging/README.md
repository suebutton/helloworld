Staging configuration for Kokiri. See ../modules/README.md for details.

# Import

Existing tables were imported using the following commands:

```
terraform import module.kokiri_staging.google_bigquery_table.kokiri btn-dlc:staging.kokiri
terraform import module.kokiri_staging.google_bigquery_table.kokiri_7d btn-dlc:staging.kokiri_7d
terraform import module.kokiri_staging.aws_elasticache_cluster.kokiri kokiri-staging
terraform state push -force terraform.tfstate
```
