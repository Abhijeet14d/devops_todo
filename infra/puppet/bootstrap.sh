#!/usr/bin/env bash
set -euo pipefail

if ! command -v puppet &>/dev/null; then
  echo "Installing puppet-agent..."
  . /etc/os-release
  CODENAME="${VERSION_CODENAME:-jammy}"
  curl -LO https://apt.puppet.com/puppet7-release-${CODENAME}.deb
  sudo dpkg -i puppet7-release-${CODENAME}.deb
  sudo apt-get update -y
  sudo apt-get install -y puppet-agent
  export PATH=/opt/puppetlabs/bin:$PATH
fi

export PATH=/opt/puppetlabs/bin:$PATH

# Apply manifests from this directory
DIR=$(cd "$(dirname "$0")" && pwd)
cd "$DIR"

sudo /opt/puppetlabs/bin/puppet apply -t --modulepath=modules manifests/site.pp
