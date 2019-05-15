<?php 
    $conn = mysqli_connect('localhost', 'root', '', 'dblab');

    if(isset($_GET['submit'])){
        $name = $_GET['name'];
        $father_name = $_GET['father_name'];
        $email = $_GET['email'];
        $phone = $_GET['phone'];
        $cnic = $_GET['cnic'];
        $gender = $_GET['gender'];
        $query = 'INSERT INTO basic_info(name, father_name, email, phone, cnic, gender) VALUES ("'.$name.'","'.$father_name.'","'.$email.'","'.$phone.'","'.$cnic.'","'.$gender.'");';
        echo $query;
        $result = mysqli_query($conn, $query);
        var_dump($result);
        header('location: index.php');
    }

    $query = 'select * from basic_info';
    $result = mysqli_query($conn, $query);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style.css">
    <title>PHP - MYSql</title>
</head>
<body>
    <form action="#">
        <label for="name">Name:&nbsp;</label>
        <input type="text" name="name">

        <label for="father_name">Father Name:&nbsp;</label>
        <input type="text" name="father_name">

        <label for="email">Email:&nbsp;</label>
        <input type="email" name="email">

        <label for="phone">Phone:&nbsp;</label>
        <input type="text" name="phone">

        <label for="cnic">CNIC:&nbsp;</label>
        <input type="text" name="cnic">

        <label for="gender">Gender:&nbsp;</label>
        <div>
            <input type="radio" name="gender" value="male" checked> Male </input>
            <input type="radio" name="gender" value="female"> Female </input>
        </div>

        <label for="submit"></label>
        <input type="submit" name="submit"  value="Add Record">

        <label></label>
        <input type="button" value="Show Records" onclick="window.location='#records'">
    </form>
    <div id="records">
        <?php while($row = mysqli_fetch_array($result)){ ?>

            <div class="record" >
                <label>Name: </label> <span><?php echo $row['name'] ?></span>
                <label>Father: </label> <span><?php echo $row['father_name'] ?></span>
                <label>email: </label> <span><?php echo $row['email'] ?></span>
                <label>phone: </label> <span><?php echo $row['phone'] ?></span>
                <label>cnic: </label> <span><?php echo $row['cnic'] ?></span>
                <label>gender: </label> <span><?php echo $row['gender'] ?></span>
            </div>

        <?php } ?>
    </div>
</body>
</html>