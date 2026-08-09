ALTER TABLE rooms
ADD CONSTRAINT rooms_board_id_valid CHECK (board_id IN ('wildland', 'wasteland'));

ALTER TABLE rooms
ADD CONSTRAINT rooms_code_valid CHECK (code ~ '^[A-Z0-9]{6}$');