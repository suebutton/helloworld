// Configure the Google Cloud provider.
provider "google" {
  credentials = "${file(pathexpand("~/.creds/bigquery-terraform.json"))}"
  project     = "btn-dlc"
  region      = "us"
}

// Stores request logs for Kokiri in staging.
resource "google_bigquery_table" "kokiri" {
  dataset_id = "${var.environment}"
  table_id   = "kokiri"
  description = "Incoming requests made to Kokiri."

  time_partitioning {
    type = "DAY"
    expiration_ms = 7776000000
  }

  labels {
    env = "${var.environment}"
    terraformed = "true"
  }

  schema = "${file("${path.module}/kokiri_schema.json")}"
}

// Stores request logs for Kokiri.
resource "google_bigquery_table" "kokiri_7d" {
  dataset_id = "${var.environment}"
  table_id   = "${google_bigquery_table.kokiri.table_id}_7d"
  description = "Kokiri requests for the past 7 days"

  labels {
    env = "${var.environment}"
    terraformed = "true"
  }

  view {
    query = <<-EOF
            SELECT * FROM
              ${var.environment}.kokiri
            WHERE
              _PARTITIONTIME is null OR
              _PARTITIONTIME BETWEEN TIMESTAMP(UTC_USEC_TO_DAY(NOW() - 7 * 60 * 60 * 24 * 1000000))
              AND TIMESTAMP(UTC_USEC_TO_DAY(CURRENT_TIMESTAMP()));
            EOF
  }
}
