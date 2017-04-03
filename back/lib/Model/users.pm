columns => {
	label => {TYPE_NAME    => 'varchar', COLUMN_SIZE  => 255},
	f => {TYPE_NAME    => 'varchar', COLUMN_SIZE  => 255},
	i => {TYPE_NAME    => 'varchar', COLUMN_SIZE  => 255},
	o => {TYPE_NAME    => 'varchar', COLUMN_SIZE  => 255},
	salt => {TYPE_NAME    => 'char', COLUMN_SIZE  => 64},
},

data => [
	{id => 1, fake => 0, login => 'admin', label => 'Условный админ', password => '095aeb3129b46cb0a91f4da067742c8ff91b4220cb8ee8dff3fd04918979e9e9', salt => '0000000000000000000000000000000000000000000000000000000000000000', id_role => 1},
],
