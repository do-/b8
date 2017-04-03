################################################################################

sub select_logon {}

################################################################################

sub do_create_sessions {

	my $data = {
		success => \1, 
		timeout => sql_sessions_timeout_in_minutes ()
	};

	$data -> {user} = sql_select_hash ("SELECT * FROM users WHERE login = ? AND password = OLD_PASSWORD(?)", $_REQUEST {-login}, $_REQUEST {-password});

	$data -> {user} -> {id} or return undef;

	sql_do ("DELETE FROM sessions WHERE id_user = ?", $data -> {user} -> {id});

	start_session ($data -> {user} -> {id});

	set_cookie (-name => 'login', -value => $_REQUEST {-login}, -httponly => 1, -path => '/_back');

       	$data;

}

################################################################################

sub do_delete_sessions {
	
	sql_do ("DELETE FROM sessions WHERE id = ?", $_REQUEST {sid});

       	{success => \1};

}

1;