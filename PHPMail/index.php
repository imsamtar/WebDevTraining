<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require 'vendor/phpmailer/phpmailer/src/Exception.php';
    require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
    require 'vendor/phpmailer/phpmailer/src/SMTP.php';

    $m = new PHPMailer;
    $m->isSMTP();
    $m->SMTPAuth = true;
    $m->Host     = 'smtp.gmail.com';

    $m->FromName = 'SAMEER TARIQ';
    $m->Username = 'YOU EMAIL GOES HERE';
    $m->From     = 'YOU EMAIL GOES HERE';
    $m->Password = 'YOUR PASSWORD GOES HERE';

    $m->addAddress('RECEIEVER EMAIL GOES HERE');
    $m->Subject  = 'Last PHP Mail';
    $m->Body     = 'This is body of email...';

    var_dump($m->send());
?>