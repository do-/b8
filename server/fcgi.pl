use Cwd 'abs_path';
my $path = abs_path ('../../core');

eval qq {

	use lib '$path';
	use Eludia::Content::HTTP::FCGI::nginx;
	start ();

};
