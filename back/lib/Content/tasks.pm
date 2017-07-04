################################################################################

sub select_tasks {
	
	my $q = $_REQUEST {search};
	
	my $data = {};
	
	unless (exists $q -> {q}) {

		add_vocabularies ($data, 'users');
		
		$data -> {tasks} = [];
		
		return $data;

	}
	
	my @ref = ('id_user', 'id_user_from');
		
	sql ($data, 'tasks' => [
		['id_user IS NOT NULL'],
		['label LIKE %?%'    => $q -> {q}],
		[$ref [$q -> {role}] => $q -> {id_user}],
		[ORDER               => 'id DESC'],
		[LIMIT               => [0 + $q -> {start}, $conf -> {portion} + 1]],
	], 'task_status');
	
	$data -> {portion} = $conf -> {portion};
		
	$data;

}

################################################################################

sub do_create_tasks {

	{id => sql_do_insert (tasks => {
		id_user_from => $_USER -> {id}
	})};
	
}