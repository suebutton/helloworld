Production configuration for Kokiri. See ../modules/README.md for details.

# Import

Existing tables were imported using the following commands:

```
$GOPATH/bin/terraform import module.kokiri_bigquery_production.google_bigquery_table.kokiri btn-dlc:production.kokiri
$GOPATH/bin/terraform state push -force terraform.tfstate
```
