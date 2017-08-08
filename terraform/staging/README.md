Staging configuration for Kokiri. See ../modules/README.md for details.

# Import

Existing tables were imported using the following commands:

```
$GOPATH/bin/terraform import module.kokiri_bigquery_staging.google_bigquery_table.kokiri btn-dlc:staging.kokiri
$GOPATH/bin/terraform import module.kokiri_bigquery_staging.google_bigquery_table.kokiri_7d btn-dlc:staging.kokiri_7d
$GOPATH/bin/terraform state push -force terraform.tfstate
```
