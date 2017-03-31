use Cwd 'abs_path';
my $path = abs_path ('../../core_cut');

eval qq {

	use lib '$path';
	use Eludia::Content::HTTP::FCGI::nginx_single;
	start ();

};
