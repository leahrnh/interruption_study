<?php

function getCode()
{
    $code = "";
    $newtext = "";
    $file_read_handle = fopen("codes.txt", "r") or die("can't open file for reading");

    while (!feof($file_read_handle)) {
        $line = fgets($file_read_handle);
        if ($code=="") {
            $code = $line;
        } else {
            $newtext = "{$newtext}$line";
        }
    }

    fclose($file_read_handle);

    //write codes back to the file with the new code at the bottom
    $file_write_handle = fopen("codes.txt", "w+") or die("can't open file for writing");
    fwrite($file_write_handle, $newtext);
    fwrite($file_write_handle, "\n");
    fwrite($file_write_handle, $code);
    fclose($file_write_handle);

    //return first line
    return $code;
}

echo getCode();
?>