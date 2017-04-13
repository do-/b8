columns => {
	id_role  => 'int = 2',
	f        => 'string[40]',
	i        => 'string[40]',
	o        => 'string[40]',	
	salt     => 'char[64]',
},

keys => {
	login => 'login!',
},

data => [
	{id => 1, fake => 0, login => 'admin', label => 'Условный админ', password => '095aeb3129b46cb0a91f4da067742c8ff91b4220cb8ee8dff3fd04918979e9e9', salt => '0000000000000000000000000000000000000000000000000000000000000000', id_role => 1},
],
