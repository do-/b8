use Digest::SHA;

our $conf = {
	
	portion => 15,
	session_timeout => 1,
		
	core_recycle_ids => 0,
	core_unlimit_xls => 1,
	
};

our $DB_MODEL = {

	default_columns => {
		id   => {TYPE_NAME  => 'int', _EXTRA => 'auto_increment', _PK    => 1},
		fake => {TYPE_NAME  => 'bigint'},
	},

};

sub password_hash {

	my ($salt, $password) = @_;
	
	my $sha = Digest::SHA -> new (256);
	
	$sha -> addfile ($preconf -> {salt_file}) if $preconf -> {salt_file};

	$sha -> add ($salt);

	$sha -> add (Encode::encode ('UTF-8', $password));

	return $sha -> hexdigest;

}
	
1;