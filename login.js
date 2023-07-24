$(document).bind('keydown', 'return', function (evt) {
	$("[name=Email]").keypress(function (e) {
		if (e.keyCode == 13) {
			$('#btnLogin').focus().click();//give your submit an ID
			return false;
		}
	});

	$("[name=Password]").keypress(function (e) {
		if (e.keyCode == 13) {
			$('#btnLogin').focus().click();//give your submit an ID
			return false;
		}
	});




});


$("#btnLogin").click(function () {
	Login(this);
});
function Login(btn) {
	debugger
	var c = new Common();
	var data = c.GetFormValues("#formLogin");
	data.DeviceUTCOffset = c.GetTimeZoneOffset();
	data = JSON.stringify(data);

	c.AjaxCall("Admin/Login/Index", JSON.stringify({ data: data }), "POST", true, function (d) {
		if (d.Status) {
			if (d.Role == 'Admin') {
				window.location = c.baseUrl + "Admin/SuperAdmin";
			}
		} else {
			c.ShowMessage(d.RetMessage, "error");
		}
	}, btn);

}

$("#btnForgetPassword").click(function () {
	ForgetPassword(this);
});
function ForgetPassword(btn) {
	var c = new Common();
	var data = c.GetFormValues("#formForgetPassword");
	data.DeviceUTCOffset = c.GetTimeZoneOffset();
	data = JSON.stringify(data);
	c.AjaxCall("Admin/ForgetPassword/Index", JSON.stringify({ data: data }), "POST", true, function (d) {
		if (d.Status) {
			window.location = c.baseUrl + "Admin/Users";

		} else {
			c.ShowMessage(d.RetMessage, "error");
		}
	}, btn);

}
