(function($){
    "use strict";
    function ai_importPartial( $status, $title, $cycles, $pause_import, $count )  {

        $.ajax({
            url: ajaxurl,
            type:'GET',
            timeout: 30000,
            dataType: 'html',
            data: {
                action: 'import_users_from_csv',
                'filename' : ai_filename,
                'password_nag': ai_password_nag,
                'users_update': ai_users_update,
                'new_user_notification': ai_new_user_notification
            },
            error: function(xml){
                window.alert('Error with import. Try refreshing.');
            },
            success: function(responseHTML){
                if (responseHTML === 'error')
                {
                    window.alert('Error with import. Try refreshing.');
                    document.title = $title;
                }
                else if(responseHTML === 'nofile')
                {
                    $status.html($status.html() + '\nCould not find the file ' + ai_filename + '. Maybe it has already been imported.');
                    document.title = $title;
                }
                else if(responseHTML === 'done')
                {
                    $status.html($status.html() + '\nDone!');
                    document.title = '! ' + $title;
                }
                else
                {
                    $status.html($status.html() + responseHTML);
                    document.title = $cycles[parseInt($count)%4] + ' ' + $title;

                    if(!$pause_import) {

                        var $import_timer = setTimeout(function () {
                            ai_importPartial( $status, $title, $cycles, $pause_import, $count );
                        }, 2000);
                    }
                }

                //scroll the text area unless the mouse is over it
                if ($('#importstatus:hover').length !== 0) {
                    $status.scrollTop($status[0].scrollHeight - $status.height());
                }
            }
        });
    }

    $(document).ready(function() {

        //find status
        var $status = $('#importstatus');
        var $row = 1;
        var $count = 0;
        var $title = document.title;
        var $cycles = ['|','/','-','\\'];
        var $pausebutton = $('#pauseimport');
        var $resumebutton = $('#resumeimport');
        var $pauseimport = false;

        //enable pause button
        $pausebutton.click(function() {
            $pauseimport = true;
            $import_timer = false;
            $pausebutton.hide();
            $resumebutton.show();

            $status.html($status.html() + 'Pausing. You may see one more partial import update under here.\n');
        });

        //enable resume button
        $resumebutton.click(function() {
            $pauseimport = false;
            $resumebutton.hide();
            $pausebutton.show();

            $status.html($status.html() + 'Resuming...\n');

            ai_importPartial( $status, $title, $cycles, $pauseimport, $count );
        });

        //start importing and update status
        if($status.length > 0)
        {
            $status.html($status.html() + '\n' + 'JavaScript Loaded.\n');
            var $import_timer = setTimeout(function() { ai_importPartial( $status, $title, $cycles, $pauseimport, $count );}, 2000);
        }
    });

})(jQuery);



