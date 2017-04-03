################################################################################

sub select_logon {}

################################################################################

sub do_create_sessions {

	my $data = {success => \1};

	$data -> {user} = sql_select_hash ("SELECT * FROM users WHERE login = ? AND password = OLD_PASSWORD(?)", $_REQUEST {-login}, $_REQUEST {-password});

	$data -> {user} -> {id} or return undef;

	sql_do ("DELETE FROM sessions WHERE id_user = ?", $data -> {user} -> {id});

	start_session ($data -> {user} -> {id});

       	$data;

}

################################################################################

sub do_delete_sessions {
	
	sql_do ("DELETE FROM sessions WHERE id = ?", $_REQUEST {sid});

       	{success => \1};

}

1;