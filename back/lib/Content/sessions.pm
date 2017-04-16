################################################################################

sub do_create_sessions {

	my $d = $_REQUEST {data};

	my $data = {
	
		success => \1, 
		
		timeout => $preconf -> {auth} -> {sessions} -> {timeout},
		
		user    => sql (users => [
			[login => $d -> {login}],
			[fake  => 0],
			[LIMIT => 1],
		]),
		
	};
	
	if (!$data -> {user} -> {id}) {
	
		warn "Non-existing login entered: $d->{login}\n";

		return undef;
	
	}

	my $hash = password_hash ($data -> {user} -> {salt}, $d -> {password});

	if ($hash ne $data -> {user} -> {password}) {
	
		warn "Wrong password entered for $d->{login}\n";
	
		return undef;
	
	}

	sql_do ("DELETE FROM sessions WHERE id_user = ?", $data -> {user} -> {id});

	start_session ($data -> {user} -> {id});

	set_cookie (-name => 'login', -value => $d -> {login}, -httponly => 1, -path => '/_back');

       	$data;

}

################################################################################

sub do_delete_sessions {
	
	sql_do ("DELETE FROM sessions WHERE id = ?", $_REQUEST {sid});

       	{success => \1};

}

1;