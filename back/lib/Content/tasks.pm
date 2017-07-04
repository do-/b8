################################################################################

sub select_tasks {
	
	my $q = $_REQUEST {search};
	
	my $data = {};
	
	add_vocabularies ($data, 'users');
	
#	$q -> {id_user} ||= $_USER -> {id};
	
	sql ($data, 'tasks' => [
		['label LIKE %?%' => $q -> {q}],
		[id_user          => $q -> {id_user}],
#		[fake             => [split ',', $q -> {fake}]],		
		[ORDER            => 'id DESC'],
		[LIMIT            => [0 + $q -> {start}, $conf -> {portion} + 1]],
	], 'task_status');
	
	$data -> {portion} = $conf -> {portion};
		
	$data;

}

