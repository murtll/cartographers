CREATE TABLE rooms (
  id         uuid PRIMARY KEY,
  code       text NOT NULL UNIQUE,
  board_id   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE events (
  room_id uuid        NOT NULL REFERENCES rooms(id),
  seq     bigint      NOT NULL,
  type    text        NOT NULL,
  payload jsonb       NOT NULL,
  at      timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (room_id, seq),
  CONSTRAINT events_type_valid CHECK (type IN (
    'room_created', 'player_joined', 'game_started',
    'round_opened', 'move_submitted', 'round_closed', 'game_ended'
  ))
);