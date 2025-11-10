# Puppet site manifest for devopsapp
# NOTE: Parameters are resolved via Hiera (see hiera.yaml and data/*.yaml)

node default {
  include devopsapp
}
