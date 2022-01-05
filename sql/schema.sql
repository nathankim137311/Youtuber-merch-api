CREATE TABLE ComedyPodcasts (
	id INT NOT NULL,
	channel_id UNIQUE VARCHAR(50) NOT NULL,
	channel_name VARCHAR(50) NOT NULL,
	store_url VARCHAR(100) NOT NULL, 
    PRIMARY KEY (id),
);

CREATE TABLE Products (
    id INT NOT NULL,
    channel_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL, 
    price DECIMAL(10, 0),
    img_src VARCHAR(150) NOT NULL, 
    PRIMARY KEY (id),
    FOREIGN KEY (channel_id) REFERENCES Youtubers(channel_id)
);