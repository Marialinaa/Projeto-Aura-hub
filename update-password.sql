USE projeto_ufla;
UPDATE usuarios SET password = '$2b$10$s4Pla2KR.vbPUXH7BYDigef//KwEt.B2tgPtrgTfrj7eoxisj.i0C' WHERE email = 'admin@sistema.com';
SELECT id, nome, email, password FROM usuarios WHERE email = 'admin@sistema.com';
