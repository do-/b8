################################################################################

sub do_update_user_files {
	
	my $user_file = sql (user_files => $_REQUEST {id});
		
	my $path = _user_files_path ($user_file);
	
	my $chunk = MIME::Base64::decode ($_REQUEST {chunk});

	my $old = 0 + -s $path;
	my $new = length $chunk;

	$old + $new <= $user_file -> {size} or die "#_file#:Передано больше байт, чем заявлено";
		
	open (F, ">>$path") or die "Can't append to $path:$!\n";
	binmode F;
	print F $chunk;
	close (F);	
	
	-s $path < $user_file -> {size} or sql_do_update (user_files => {fake => 0});

}

################################################################################

sub _user_files_path {

	my ($f) = @_;
	
	my $ext = $f -> {label} =~ /.*\./ ? $' : 'bin'; #'

	$preconf -> {files} -> {root} . "/users/files/$f->{id}.$ext";

}

################################################################################

sub do_create_user_files {

	my $file = $_REQUEST {file};

	$file -> {size} < 10 * 1024 * 1024 or die "#_file#:Превышен объём файла";

	$file -> {id} = sql_do_insert (user_files => $file);
	
}

################################################################################

sub do_delete_user_files {

	sql_do_update (user_files => {fake => -1});

}

################################################################################

sub do_undelete_user_files {

	sql_do_update (user_files => {fake => 0});
	
	sql (user_files => $_REQUEST {id});

}

################################################################################

sub get_item_of_user_files {

	sql (user_files => $_REQUEST {id});

}

################################################################################

sub get_content_of_user_files {

	my $file = sql (user_files => $_REQUEST {id});
	
	$file -> {path} = _user_files_path ($file);

	-f $file -> {path} or die "$path not found\n";

	my $s = -s $file -> {path};
	
	$s == $file -> {size} or die "$path is corrupted: $s != $file->{size}\n";
	
	$file -> {file_name} = delete $file -> {label};

	download_file ($file);

}

1;