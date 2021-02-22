
// Constructor function (Doi tuong Validator)
function Validator(options) {
    // Ham thuc hien validate
        function validate(inputElement, rule) {
            var errorMessage = rule.test(inputElement.value);
            var errorElement = inputElement.parentElement.querySelector(options.errorElement);
    
                        if(errorMessage) {
                            errorElement.innerText = errorMessage;
                            inputElement.parentElement.classList.add('invalid')
                        } else {
                            errorElement.innerText = '';
                            inputElement.parentElement.classList.remove('invalid')
                        }
        }
        // lay element cua form can validate
        var formElement = document.querySelector(options.form);
        if (formElement) {
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                if (inputElement) {
    
                    // Xu ly truong hop blur ra khoi input
                    inputElement.onblur = function() {
                        validate(inputElement, rule);
                    }
    
                    // Xu ly truong hop moi khi nguoi dung nhap vao input
                    inputElement.oninput = function() {
                        var errorElement = inputElement.parentElement.querySelector('.form-message');
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid')
                    }
                }
            });
        }
    }
    
    
    
    // Dinh nghia cac rules
    // Nguyen tac cua cac rule:
    // 1.Khi co loi, thi tra ra messagge loi
    // 2.Khi hop le, thi khong tra ra gi ca.(Undefinded)
    Validator.isRequired = function(selector) {
        return {
            selector: selector,
            test: function(value) {
                return value.trim() ? undefined : 'Vui lòng nhập trường này'
            }
        }
    };
    
    Validator.isEmail = function(selector) {
        return {
            selector: selector,
            test: function(value) {
                var regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                return regexEmail.test(value) ? undefined : 'Trường này phải là email';
            }
        }
    };
    
    Validator.minLength = function(selector, min) {
        return {
            selector: selector,
            test: function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
            }
        }
    };