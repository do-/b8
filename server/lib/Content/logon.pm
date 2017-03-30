################################################################################

sub select_logon {}

################################################################################

sub do_execute_logon {
	our $_USER = {};
	$_USER -> {id} = sql_select_array ("SELECT id FROM users WHERE login = ? AND password = OLD_PASSWORD(?)", $_REQUEST {login}, $_REQUEST {password});
	$_USER -> {id} or return;
	$_REQUEST {sid} = sql_select_array ("select floor(rand() * 9223372036854775807)");
	sql_do ("DELETE FROM sessions WHERE id_user = ?", $_USER -> {id});
	sql_do ("INSERT INTO sessions (id, id_user) VALUES (?, ?)", $_REQUEST {sid}, $_USER -> {id});
	delete $_REQUEST {type};
	delete $_REQUEST {login};
	delete $_REQUEST {password};
}

################################################################################

sub do_execute_users_logon {

	my $data = sql (users => [[]]);
	
	out_json ($data);

}

################################################################################

sub do_execute_user_logon {

	my $data = sql (users => $_REQUEST {id});
	
	out_json ($data);

}

################################################################################

sub do_execute_json_logon {

	my $data = {success => \1};
	
	$data -> {user} = sql_select_hash ("SELECT * FROM users WHERE login = ? AND password = OLD_PASSWORD(?)", $_REQUEST {login}, $_REQUEST {password});
	
	$data -> {user} -> {id} or return out_json ({success => \0});
	
	$data -> {sid} = sql_select_array ("select floor(rand() * 9223372036854775807)");

	sql_do ("DELETE FROM sessions WHERE id_user = ?", $data -> {user} -> {id});

	sql_do ("INSERT INTO sessions (id, id_user) VALUES (?, ?)", $data -> {sid}, $data -> {user} -> {id});

       	out_json ($data);
	
}

1;
