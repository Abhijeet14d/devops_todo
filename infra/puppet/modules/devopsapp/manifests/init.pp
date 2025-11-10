class devopsapp (
  String $frontend_image        = 'abhijeet14d/devopsapp-frontend:latest',
  String $backend_image         = 'abhijeet14d/devopsapp-backend:latest',
  String $client_url            = 'http://localhost',
  String $api_url               = 'http://localhost:5000/api',
  String $mongodb_uri           = '<unset_mongodb_uri>',
  String $jwt_secret            = '<unset_jwt_secret>',
  String $email_user            = '<unset_email_user>',
  String $email_pass            = '<unset_email_pass>',
) {

  package { ['curl','gnupg','lsb-release','ca-certificates']: ensure => installed }

  exec { 'install_docker':
    command => '/usr/bin/curl -fsSL https://get.docker.com | sh',
    creates => '/usr/bin/docker',
    path    => ['/usr/bin','/bin','/usr/sbin','/sbin'],
  }

  group { 'docker': ensure => present }

  user { 'ubuntu':
    ensure => present,
    groups => ['docker'],
    require => Group['docker'],
  }

  file { '/opt/devopsapp':
    ensure => directory,
    owner  => 'ubuntu',
    group  => 'ubuntu',
    mode   => '0755',
  }

  file { '/opt/devopsapp/docker-compose.yml':
    ensure  => file,
    owner   => 'ubuntu',
    group   => 'ubuntu',
    mode    => '0644',
    content => template('devopsapp/docker-compose.yml.erb'),
    require => File['/opt/devopsapp'],
  }

  exec { 'compose_pull':
    command     => '/usr/bin/docker compose pull',
    cwd         => '/opt/devopsapp',
    path        => ['/usr/bin','/bin'],
    refreshonly => true,
    subscribe   => File['/opt/devopsapp/docker-compose.yml'],
  }

  exec { 'compose_up':
    command     => '/usr/bin/docker compose up -d',
    cwd         => '/opt/devopsapp',
    path        => ['/usr/bin','/bin'],
    refreshonly => true,
    subscribe   => Exec['compose_pull'],
  }

  package { 'nginx': ensure => installed }

  file { '/etc/nginx/sites-available/devopsapp.conf':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => template('devopsapp/nginx.conf.erb'),
    require => Package['nginx'],
  }

  file { '/etc/nginx/sites-enabled/devopsapp.conf':
    ensure => link,
    target => '/etc/nginx/sites-available/devopsapp.conf',
    require => File['/etc/nginx/sites-available/devopsapp.conf'],
  }

  file { '/etc/nginx/sites-enabled/default':
    ensure => absent,
    require => Package['nginx'],
  }

  service { 'nginx':
    ensure    => running,
    enable    => true,
    subscribe => File['/etc/nginx/sites-available/devopsapp.conf'],
  }
}
