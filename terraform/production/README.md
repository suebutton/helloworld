Production configuration for Kokiri. See ../modules/README.md for details.

# Import

Existing tables were imported using the following commands:

```
terraform import module.kokiri_production.google_bigquery_table.kokiri btn-dlc:production.kokiri
terraform import module.kokiri_production.aws_elasticache_cluster.kokiri kokiri-production
terraform state push -force terraform.tfstate
```
