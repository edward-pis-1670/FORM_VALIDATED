
// Constructor function (Doi tuong Validator)
function Validator(options) {
    // tao ham lay the cha ngoai cung
    function  getParent(element, selector) {
        // element thuc ra chinh la inputElement da co
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var colectionRules = {};
    // Ham thuc hien validate
    function validate(inputElement, rule) {
        var rules = colectionRules[rule.selector];
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorM);
        var errorMessage;
        for(i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break;
        }
        if(errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage;
    }
    // lay element cua form can validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                if (Array.isArray(colectionRules[rule.selector])) {
                    colectionRules[rule.selector].push(rule.test);
                } else {
                    colectionRules[rule.selector] = [rule.test];
                }
                // Xu ly truong hop blur ra khoi input
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }

                // Xu ly truong hop moi khi nguoi dung nhap vao input
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorM);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            }
        });
    }
    // Xu ly hanh dong Submit
    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isFormValid = true;
            // Thuc hien lap qua tung rule & validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                // Truong hop submit voi JS
                if (typeof options.onSubmit === 'function') {
                    var enableInputs =formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input){
                        return (values[input.name] =input.value) && values;
                    }, {})
                    options.onSubmit(formValues);
                }
                // Truong hop submit mac dinh
                else {
                    formElement.submit();
                }
            }
        }
    }
}



// Dinh nghia cac rules
// Nguyen tac cua cac rule:
// 1.Khi co loi, thi tra ra messagge loi
// 2.Khi hop le, thi khong tra ra gi ca.(Undefinded)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
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

Validator.isConfirmed = function (selector, getConfirmValue) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : 'Mật khẩu nhập lại không chính xác';
        }
    }
}

