resource "aws_elasticache_cluster" "kokiri" {
  cluster_id           = "kokiri-${var.environment}"
  engine               = "redis"
  node_type            = "cache.t2.small"
  port                 = 6379
  engine_version       = "2.8.24"
  num_cache_nodes      = 1
  parameter_group_name = "lru-cache"
  subnet_group_name    = "internal-subnet"
}
