var pageNumber = 1;
$(document).bind('keydown', 'return', function (evt) {
	$("#Search").keypress(function (e) {
		if (e.keyCode == 13) {
			$('#btnSearch').focus().click();//give your submit an ID
			return false;
		}
	});
});

$(document).ready(function () {
	$("#liSuperAdmin").addClass("active");

	$("#btnSearch").click(function () {
		FilterRecords(1);
	});

	$("#ddlPageSize").change(function () {
		debugger
		FilterRecords(pageNumber);
	});
	$("#btnAddNew").click(function () {
		debugger
		var c = new Common();
		c.ClearFormValues("#adduser-form");
		$("[data-element=Password],[data-element=ConfirmPassword],[data-element=Email]").val('')
		$("[data-element=RecordStatus]").val('Active')
		$("#modalAddUser").modal('show')
	})

	FilterRecords(pageNumber);
});

function initSorting() {
	$('.table.table-striped th.sortable').off("click");
	$('.table.table-striped th.sortable').click(function () {

		var o = $(this).hasClass('sorting_asc') ? 'sorting_desc' : 'sorting_asc';
		$(this).parents('table').find('th.sortable').removeClass('sorting_asc').removeClass('sorting_desc');
		$(this).addClass(o);

		var sortOrder = $(this).hasClass('sorting_asc') ? 'ASC' : 'DESC';
		var sortBy = $(this).data("sortby");

		var c = new Common();
		var data = {};
		data["Search"] = $("#Search").val();
		data["Pageindex"] = 1;
		data["Pagesize"] = $("#ddlPageSize").val();
		data["sortColumn"] = sortBy;
		data["sortOrder"] = sortOrder;
		$("#tbodyUsers").html("");

		c.AjaxCall("Admin/SuperAdmin/GetUsers", $.param(data), "GET", true, function (d) {
			CreateTable(d);
			initSorting();
			Paginate(d);
		});

	});
}

function FilterRecords(page) {
	debugger
	pageNumber = page;
	var c = new Common();
	var data = {};
	data["Search"] = $("#Search").val();
	data["Pageindex"] = page;
	data["Pagesize"] = $("#ddlPageSize").val();
	var column = "";
	if ($("#datatable tr th").hasClass('sorting_asc') || $("#datatable tr th").hasClass('sorting_desc')) {
		column = $("#datatable tr th.sorting_asc,th.sorting_desc").data('sortby');
	} else {
		column = "AdminUserId"
	}
	data["sortColumn"] = column;
	data["sortOrder"] = $("#datatable tr th").hasClass('sorting_asc') ? 'ASC' : 'DESC';

	$("#tbodyUsers").html("");
	c.AjaxCall("Admin/SuperAdmin/GetUsers", $.param(data), "GET", true, function (d) {
		CreateTable(d);
		
		initSorting();
		Paginate(d);
	});
}

function CreateTable(data) {
	var html = "";
	if (data.Items == undefined) return;

	for (var i = 0; i < data.Items.length; i++) {
		html += "<tr id=tr" + data.Items[i].AdminUserId + ">"
		html += "<td style='word-break:break-all'>" + GetDateValue(data.Items[i].CreatedDate) + "</td>"
		html += "<td style='word-break:break-all'>" + data.Items[i].Email + "</td>"
		html += "<td style='word-break:break-all'>" + data.Items[i].Role + "</td>"
		html += "<td style='word-break:break-all'>" + data.Items[i].RecordStatus + "</td>"
		if (data.Items[i].AdminUserId != 1) {
			html += "<td><a href='javascript:void(0)' class='btn btn-info btn-sm view' data-userid='" + data.Items[i].AdminUserId + "' onclick='GetById(this)' style='margin-left:5px;margin-top: 5px;'>Edit </a></div>";
			html += "<input type='button' class='btn btn-info btn-sm Delete' value='Del' data-userid='" + data.Items[i].AdminUserId + "' onclick='Delete(" + data.Items[i].AdminUserId + ")' style='margin-left:5px;margin-top: 5px;' /></td>";
		} else {
			html += "<td></td>"
		}

		+ "</tr>";
	}
	$("#tbodyUsers").html(html);
}

function Paginate(data) {
	var pagination = "";
	var counter = 0;
	if (data.PageNumber > 1) {
		pagination += '<li><a href="javascript:FilterRecords(' + (data.PageNumber - 1) + ')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
	}
	else {
		pagination += '<li class="disabled"><a href="javascript:void(0);" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
	}

	var start = 0;
	if (data.PageCount > 5) {
		if (data.PageNumber > 2) {
			if ((data.PageCount - data.PageNumber) == 0) {
				var pageNumber = (data.PageCount - data.PageNumber + 3);
				pagination += '<li><a href="javascript:FilterRecords(' + (data.PageNumber - (pageNumber + 1)) + ')">' + (data.PageNumber - (pageNumber + 1)) + '</a></li>';
				pagination += '<li><a href="javascript:FilterRecords(' + (data.PageNumber - pageNumber) + ')">' + (data.PageNumber - pageNumber) + '</a></li>';
			}
			if ((data.PageCount - data.PageNumber) == 1) {
				var pageNumber = (data.PageCount - data.PageNumber + 2);
				pagination += '<li><a href="javascript:FilterRecords(' + (data.PageNumber - pageNumber) + ')">' + (data.PageNumber - pageNumber) + '</a></li>';
			}
			pagination += '<li><a href="javascript:FilterRecords(' + (data.PageNumber - 2) + ')">' + (data.PageNumber - 2) + '</a></li>';
			pagination += '<li><a href="javascript:FilterRecords(' + (data.PageNumber - 1) + ')">' + (data.PageNumber - 1) + '</a></li>';
		}
		else if (data.PageNumber == 2) {
			pagination += '<li><a href="javascript:FilterRecords(' + (data.PageNumber - 1) + ')">' + (data.PageNumber - 1) + '</a></li>';
		}
		for (var i = data.PageNumber; i <= data.PageCount; i++) {
			counter++;

			pagination += '<li class=' + (data.PageNumber == i ? "active" : "") + '><a href="javascript:FilterRecords(' + i + ')">' + i + '</a></li>';
			if (data.PageNumber > 2 && counter == 3) {
				break;
			}
			else if (data.PageNumber == 2 && counter == 4) {
				break;
			}
			else if (counter == 5) {
				break;
			}
			else { }
		}
	}
	else {
		for (var i = 1; i <= data.PageCount; i++) {
			pagination += '<li class=' + (data.PageNumber == i ? "active" : "") + '><a href="javascript:FilterRecords(' + i + ')">' + i + '</a></li>';
		}
	}

	if (data.PageNumber < data.PageCount) {
		pagination += '<li><a href="javascript:FilterRecords(' + (data.PageNumber + 1) + ')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
	}
	else {
		pagination += '<li class="disabled"><a href="javascript:void(0);" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
	}

	$("#pagination").html(pagination);
	if (typeof data.PageNumber == "undefined") {
		data.PageNumber = 0;
	}
	if (typeof data.PageCount == "undefined") {
		data.PageCount = 0;
	}
	$("#page").text("Page " + data.PageNumber + " of " + data.PageCount);
}

function roundTo2Decimals(numberToRound) {
	return Math.round(numberToRound * 100) / 100
}


function SaveUser() {
	var c = new Common();
	if (c.validate("#adduser-form")) {
		var data = c.GetFormValues("#adduser-form");
		data["UserID"] = $('#hfUserId').val();
		data["RecordStatus"] = $('#RecordStatus').val();
		data = JSON.stringify(data);
		c.AjaxCall("Admin/SuperAdmin/updateuser", JSON.stringify({ data: data }), "POST", true, function (d) {
			if (d.Status) {
				$('#modalAddUser').modal('hide');
				c.ShowMessage(d.RetMessage, "success");
				FilterRecords(pageNumber);
			}
			else {
				c.ShowMessage(d.RetMessage, "error");
			}

		});
	}
}

function GetById(obj) {
	var c = new Common();
	var data = {};
	data["UserID"] = $(obj).data('userid');
	data = JSON.stringify(data);
	c.AjaxCall("Admin/SuperAdmin/GetById", JSON.stringify({ data: data }), "POST", true, function (d) {
		$("#adduser-form input").each(function (i, v) {
			debugger;
			$(v).val(d.Data[v["name"]]);
		})
		$("[data-elemement=RecordStatus]").val(d.Data["RecordStatus"]);
		$("#hfUserId").val(d.Data["UserID"]);
		$("#modalAddUser").modal('show')
	});
}

function Delete(id) {
	var c = new Common();
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
			new Common().AjaxCall("Admin/SuperAdmin/Delete/" + id, {}, "DELETE", true, function (d) {
				if (d) {
					$('#tr' + id).remove();
					c.ShowMessage("Deleted successfully.., ", "success");
					FilterRecords(1);
				}
			});
		} else {
			return false;
		}
	});
}
