use hostel_management;

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
select * from users;
delete from users;
insert into rooms VALUES(1,'Double',2000,1);
select * from rooms;
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE DATE NOT NULL,
  status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ,
  FOREIGN KEY (room_id) REFERENCES rooms(id) 
); 
insert into rooms values(2,'Single',3000,1);
select * from rooms;
update rooms set price=3000 where id=2;
 
INSERT INTO reservations (id, user_id, room_id, start_date, end_date, status)
VALUES (14, 3, 2, '2025-05-23', '2029-07-24', 'Confirmed');
show reservations;
select * from reservations;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

INSERT INTO rooms  VALUES (3,'Double', 2500, 1);
INSERT INTO rooms  VALUES (4,'Single', 3500, 1);

select * from admins;
SELECT * FROM reservations;
select * from users;