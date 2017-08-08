Production configuration for Kokiri.

WARNING: This configuration requires a modified version of terraform. See [the wiki](https://button.phacility.com/w/engineering/terraform/) for instructions on building and configuring Terraform at button.

# Resources

This configuration currently manages the following resources:

* Logs tables in BigQuery

This configuration DOES NOT manage:

* ECS instances
* ELB
* Network configuration
