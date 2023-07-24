
$(document).ajaxComplete(
	function (event, xhr, settings) {
		if (xhr.status == 401) {
			window.location.href = "https://localhost:44373/admin/login";
		}

	});


function RootPath() {
	return "https://localhost:44373/Admin/";
}


function RootPathAPI() {
	return "https://localhost:44373/";
	//return "/DimensionCapital/";
}

var Common = function () {
	_this = this;
	var baseUrl = "https://localhost:44373/";
	_this.baseUrl = baseUrl;
	// Read a page's GET URL variables and return them as an associative array.
	_this.getVars = function (url) {
		var formData = new FormData();
		var split;
		$.each(url.split("&"), function (key, value) {
			split = value.split("=");
			formData.append(split[0], decodeURIComponent(split[1].replace(/\+/g, " ")));
		});

		return formData;
	}

	_this.AjaxCall = function (url, data, methodType, isAsync, callback) {
		
		$.ajax({
			type: methodType,
			dataType: 'json',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8', // text for IE, xml for the rest ,
			url: baseUrl + url,
			data: data,
			async: isAsync,
			success: function (response) {
				$(btn).val(value).prop("disabled", false);
				callback(response);
			},
			error: function (jqXhr, textStatus, errorThrown) {
				if (jqXhr.getResponseHeader('Content-Type').indexOf('application/json') > -1) {
					// only parse the response if you know it is JSON
					var error = $.parseJSON(jqXhr.responseText);
					_this.ShowMessage(error.Message, "error");
				} else {
					_this.ShowMessage("Oops! Something went wrong, please try again later.", "error");
				}
				//$(".modal").modal("hide");

			}
		});
	};

	_this.AjaxCall = function (url, data, methodType, isAsync, callback, btn) {

		var value = $(btn).val();
		$(btn).val("Processing...").prop("disabled", true);
		$.ajax({
			type: methodType,
			dataType: 'json',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8', // text for IE, xml for the rest ,
			url: baseUrl + url,
			data: data,
			async: isAsync,
			success: function (response) {
				$(btn).val(value).prop("disabled", false);
				callback(response);
			},
			error: function (jqXhr, textStatus, errorThrown) {
				if (jqXhr.getResponseHeader('Content-Type').indexOf('application/json') > -1) {
					// only parse the response if you know it is JSON
					var error = $.parseJSON(jqXhr.responseText);
					_this.ShowMessage(error.Message, "error");
				} else {
					_this.ShowMessage("Oops! Something went wrong, please try again later.", "error");
				}
				//$(".modal").modal("hide");
				$(btn).val(value).prop("disabled", false);
			}
		});
	}

	_this.AjaxCallButton = function (url, data, methodType, isAsync, callback, btn) {
		var value = $(btn).html();
		$(btn).html("Loading...").prop("disabled", true);
		$.ajax({
			type: methodType,
			dataType: 'json',
			crossDomain: true,
			contentType: 'application/json; charset=utf-8', // text for IE, xml for the rest ,
			url: baseUrl + url,
			data: data,
			async: isAsync,
			success: function (response) {
				$(btn).html(value).prop("disabled", false);
				callback(response);
			},
			error: function (jqXhr, textStatus, errorThrown) {
				if (jqXhr.getResponseHeader('Content-Type').indexOf('application/json') > -1) {
					// only parse the response if you know it is JSON
					var error = $.parseJSON(jqXhr.responseText);
					_this.ShowMessage(error.Message, "error");
				} else {
					_this.ShowMessage("Oops! Something went wrong, please try again later.", "error");
				}
				//$(".modal").modal("hide");
				$(btn).html(value).prop("disabled", false);
			}
		});
	}

	_this.ConfirmAjaxCall = function (url, data, methodType, isAsync, callback, btn, txt) {
		if (txt != "" && txt != null) {
			$("#txtGlobal").text(txt);
		}
		else {
			$("#txtGlobal").text("Are you sure that you want to delete?");
		}

		$("#myGlobalModal").modal("show");

		$("#btnGlobalConfirm").off().click(function () {
			_this.AjaxCall(url, data, methodType, isAsync, callback, btn);
			$("#myGlobalModal").modal("hide");
		});
	}

	_this.AjaxCallFormData = function (url, data, isAsync, callback, btn) {
		var value = $(btn).val();
		$(btn).val("Processing...").prop("disabled", true);

		$.ajax({
			url: baseUrl + url,
			data: data,
			//crossDomain: true,
			contentType: false,
			processData: false,
			async: isAsync,
			type: 'POST',
			//headers: {
			//    "Authorization": "Basic " + btoa("admin" + ":" + "admin")
			//},
			success: function (response) {
				$(btn).val(value).prop("disabled", false);
				callback(response);
			},
			error: function (jqXhr, textStatus, errorThrown) {
				$(btn).val(value).prop("disabled", false);
				if (jqXhr.getResponseHeader('Content-Type').indexOf('application/json') > -1) {
					// only parse the response if you know it is JSON
					var error = $.parseJSON(jqXhr.responseText);
					_this.ShowMessage(error.Message, "error");
				} else {
					_this.ShowMessage("Oops! Something went wrong, please try again later.", "error");
				}
				//$(".modal").modal("hide");
			}
		});
	}

	_this.AjaxCallFormData = function (url, data, isAsync, callback) {

		$.ajax({
			url: baseUrl + url,
			data: data,
			//crossDomain: true,
			contentType: false,
			processData: false,
			async: isAsync,
			type: 'POST',
			//headers: {
			//    "Authorization": "Basic " + btoa("admin" + ":" + "admin")
			//},
			success: function (response) {
				callback(response);
			},
			error: function (jqXhr, textStatus, errorThrown) {
				$(btn).val(value).prop("disabled", false);
				if (jqXhr.getResponseHeader('Content-Type').indexOf('application/json') > -1) {
					// only parse the response if you know it is JSON
					var error = $.parseJSON(jqXhr.responseText);
					_this.ShowMessage(error.Message, "error");
				} else {
					_this.ShowMessage("Oops! Something went wrong, please try again later.", "error");
				}
				//$(".modal").modal("hide");
			}
		});
	}

	_this.Confirm = function () {
		swal({
			title: "Are you sure?",
			text: "You will not be able to recover this entry!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#e74c3c",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel please!",
			closeOnConfirm: true,
			closeOnCancel: true
		}, function (isConfirm) {
			if (isConfirm) {
				console.log(isConfirm);
				return true;
			} else {
				return false;
			}
		});
	}

	_this.Delete = function (url, data, methodType, isAsync, callback, btn, txt) {
		if (txt != "" && txt != null) {
			$("#lblSure").text(txt);
		}
		else {
			$("#lblSure").text("Are you sure to delete record?");
		}
		$("#myModalConfirm").modal("show");
		$("#confimdelete").click(function () {
			_this.AjaxCall(url, data, methodType, isAsync, callback, btn);
			$("#myModalConfirm").modal("hide");
		});
	}

	_this.ShowMessage = function (msg, type) {
		toastr.options = {
			"closeButton": true,
			"debug": false,
			"newestOnTop": true,
			"progressBar": true,
			"positionClass": "toast-bottom-full-width",
			"preventDuplicates": false,
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "10000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		}
		toastr[type](msg, type.charAt(0).toUpperCase() + type.slice(1))
	}

	_this.ShowAlertMessage = function (msg, type) {
		var title = 'Success!';
		if (type != 'success') {
			title = 'Failure!';
		}
		swal({
			type: type,
			title: title,
			confirmButtonColor: "#292929",
			text: msg,
			confirmButtonText: "OK"
		}, function (isConfirm) {
			window.location.href = 'http://myProviderlab.com/';
		}
		);
	}
	_this.validate = function (id) {
		// Validation
		if ($("" + id).length > 0) {
			if (!$("" + id).validationEngine('validate',
				{
					scroll: false,
					promptPosition: "bottomLeft"
				})) {
				return false;
			}
			else {
				return true;
			}
		}
	}

	_this.getValues = function (id, cls) {
		var json = {};
		$(id, cls).find("input[type=text], select, textarea, input[type=hidden]").each(function () {
			if ($(this).is("[data-element]")) {
				json[$(this).attr("data-element")] = $(this).val();
			}
		});
		return json;
	}

	_this.GetFormValues = function (form) {
		var json = {};
		$(form).find("input, select, textarea").each(function () {
			if ($(this).is("[name]")) {
				if ($(this).is(':checkbox')) {
					json[$(this).attr("name")] = $(this).is(":checked");
				}
				else if ($(this).is(':radio')) {
					json[$(this).attr("name")] = $('input[name=' + $(this).attr("name") + ']:checked').val();
				}
				else {
					json[$(this).attr("name")] = $(this).val();
				}
			}

		});
		return json;
	}

	_this.ClearFormValues = function (form) {
		var json = {};
		$(form).find("input[type=text], select, textarea, input[type=hidden]").each(function () {
			if ($(this).is("[data-element]")) {
				json[$(this).attr("data-element")] = $(this).val("");
			}
		});
		return json;
	}

	_this.GetQueryStringParams = function (sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return sParameterName[1];
			}
		}
	}

	_this.CommaNumber = function (num) {
		return Number(num).toLocaleString('en');
	}

	_this.getFormObj = function (formId) {
		var formObj = new FormData();
		var inputs = $("" + formId).serializeArray();
		//var inputs = $("#" + formId).closest('div').find("input,select").serialize();
		$.each(inputs, function (i, input) {
			formObj.append(input.name, input.value);
		});
		return formObj;
	}

	//D:\Salman_SDS\Projects\TFS\TellUsKnow\TellUsNow\Areas\Admin\Content\js\plugins\jquery-file-upload\jquery.fileupload.js
	// cmn.readImage("#userimage", this.files);
	_this.readImage = function (id, myfiles) {
		if (myfiles && myfiles[0]) {
			var FR = new FileReader();
			FR.onload = function (e) {
				$('' + id).attr("src", e.target.result);
				$('' + id).width(124).height(124);
				//$('' + id).html("<img src='" + e.target.result + "' id='userimage' style='width:124px; height:124px' />");
				//$("#base64").val(e.target.result);
			};
			FR.readAsDataURL(myfiles[0]);
		}
	}

	_this.GetTimeZoneOffset = function () {
		var BrowserDate = new Date();
		return ((BrowserDate.getTimezoneOffset() / 60) * (-100));
	}

	var $idown;  // Keep it outside of the function, so it's initialized once.
	_this.downloadURL = function (url) {
		if ($idown) {
			$idown.attr('src', url);
		} else {
			$idown = $('<iframe>', { id: 'idown', src: url }).hide().appendTo('body');
		}
	}



}

function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if ((charCode != 46 || jQuery(this).val().indexOf('.') != -1) && (charCode < 48 || charCode > 57))
		return false;
	return true;
}

function isNumber(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if ((charCode != 45 || $(this).val().indexOf('-') != -1) && (charCode < 48 || charCode > 57))
		return false;
	return true;
}

function GetDateValue(objDate) {
	var dateval = new Date(parseInt(objDate.replace("/Date(", "").replace(")/", ""), 10));
	var dateParts = dateval.toString().split(' ');
	var returnDate = GetMonthNumber(dateParts[1]) + '/' + dateParts[2] + '/' + dateParts[3];
	return returnDate;
}

function GetMonthNumber(mnth) {
	//Wed Jan 02 2013 00:00:00 GMT+0500 (Pakistan Standard Time)
	switch (mnth) {
		case 'Jan':
			return '01';
			break;
		case 'Feb':
			return '02';
			break;
		case 'Mar':
			return '03';
			break;
		case 'Apr':
			return '04';
			break;
		case 'May':
			return '05';
			break;
		case 'Jun':
			return '06';
			break;
		case 'Jul':
			return '07';
			break;
		case 'Aug':
			return '08';
			break;
		case 'Sep':
			return '09';
			break;
		case 'Oct':
			return '10';
			break;
		case 'Nov':
			return '11';
			break;
		default:
			return '12';
			break;
	}
}
