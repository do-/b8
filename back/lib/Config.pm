use Digest::SHA;

our $conf = {
	
	portion => 2,
		
	sql_features => ['idx.partial'],
	
#	systables => {sessions => 'foo'},
	
};

sub password_hash {

	my ($salt, $password) = @_;
	
	my $sha = Digest::SHA -> new (256);
	
	$sha -> addfile ($preconf -> {salt_file}) if $preconf -> {salt_file};

	$sha -> add ($salt);

	$sha -> add (Encode::encode ('UTF-8', $password));

	return $sha -> hexdigest;

}

#################################################################################

sub check_session {

	our $_USER = get_user ();

	if (!$_USER -> {id} && ($_REQUEST {type} ne 'sessions')) {
	
		$r -> status (401);
		
		send_http_header ();
	
	}	

}

#################################################################################

sub get_page_data {

	require_content $_REQUEST {type};
	
	$_REQUEST {action} or return call_for_role (($_REQUEST {id} ? 'get_item_of_' : 'select_') . $_REQUEST {type});
	
	$db -> {AutoCommit} = 0;
	
	my $data = call_for_role ("do_$_REQUEST{action}_$_REQUEST{type}");
	
	call_for_role ("recalculate_$_REQUEST{type}");

	$db -> commit;
	
	return $data;

}

#################################################################################

sub handle_valid_request {

	$r -> status (200);

	my $page = {success => \1};

	eval {

		sql_reconnect ();

		check_session (); $r -> status () eq 200 or return;

		$page -> {content} = get_page_data () if $_REQUEST {type};

	};
	
	if ($@) {
	
		$page -> {success} = \0;
	
		if ($@ =~ /^\#(.*?)\#\:/) {

			$page -> {field}   = $1;
			$page -> {message} = $';
			$page -> {message} =~ s{ at .*}{}gsm;

		}
		else {

			my $time = time;

			my ($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime ($time);
			
			$page -> {id} = Digest::MD5::md5_hex ($$ . $@ . $time . rand ());

			$page -> {dt} = sprintf ('%04d-%02d-%02d %02d:%02d:%02d.%03d', $year + 1900, $mon + 1, $mday, $hour, $min, $sec, 1000 * ($time - int $time));

			warn "[$page->{dt} $$]\t$page->{id}\t$@\n";

			$h -> {dt} =~ y{ }{T};
			
			$r -> status (500);
			
		}
	
	}
	
	out_json $page;

}

#################################################################################

sub handler {

	our @_PROFILING_STACK = ();

	__profile_in ('handler.request');
		
	is_request_ok (@_) and handle_valid_request ();
	
	__profile_out ('handler.request' => {label => "type='$_REQUEST{type}' id='$_REQUEST{id}' action='$_REQUEST{action}' id_user='$_USER->{id}'"});

}

1;