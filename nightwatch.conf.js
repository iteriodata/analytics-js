require('babel-core/register');

module.exports = (function() {
    return {
        src_folders : ['tests'],
        output_folder : 'reports',
        custom_commands_path : ['./node_modules/nightwatch-xhr/es5/commands'],
        custom_assertions_path : ['./node_modules/nightwatch-xhr/es5/assertions'],
        page_objects_path : '',
        globals_path : '',

        selenium : {
            start_process : false,
            server_path : '',
            log_path : '',
            port : 4444,
            cli_args : {
                'webdriver.chrome.driver' : ''
            }
        },

        test_settings : {
            default : {
                launch_url : 'http://localhost:3000',
                selenium_port  : 4444,
                selenium_host  : 'localhost',
                silent: true,
                screenshots : {
                    enabled : false,
                    path : ''
                },
                desiredCapabilities: {
                    browserName: 'chrome'
                },
                globals: {
                    baseUrl: 'http://localhost:3000'
                }
            }
        }
    };
})();
