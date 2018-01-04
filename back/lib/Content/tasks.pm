################################################################################

sub _select_tasks {
	
	my $q = $_REQUEST {search};
	
	my $data = {};
	
	unless (exists $q -> {q}) {

		add_vocabularies ($data, 'users');
		
		$data -> {tasks} = [];
		
		return $data;

	}
	
	my @ref = ('id_user', 'id_user_from');
	
	if ($q -> {role}) {
		$q -> {id_user_to} ||= undef;
	}
	else {
		delete $q -> {id_user_to};
	}
		
	sql ($data, 'tasks' => [
		['id_user IS NOT NULL'],			# == (id_task_status < 300), but faster
		['label LIKE %?%'    => $q -> {q}],
		['id_user_to'        => $q -> {id_user_to}],
		[$ref [$q -> {role}] => $q -> {id_user}],	# initiator or executor
		[ORDER               => 'id DESC'],
		[LIMIT               => [0 + $q -> {start}, $conf -> {portion} + 1]],
	], 'task_status');
	
	$data -> {portion} = $conf -> {portion};
		
	$data;

}

################################################################################

sub do_create_tasks {

	$_REQUEST {data} {id_user_to} or die '#id_user_to#: Не указан адресат';

	{id => sql_do_insert (tasks => {
		id_user_from => $_USER -> {id},
		id_user_to   => $_REQUEST {data} {id_user_to}
	})};
	
}

################################################################################

sub get_item_of_tasks {

	my $data = sql ("tasks");
		
	$data;
	
}