using LawyerWatch.Controllers.BusinessLayer.V1;
using LawyerWatch.Controllers.Enum;
using LawyerWatch.Library.CacheProvider;
using LawyerWatch.Library.Utilities;
using LawyerWatch.Models;
using LawyerWatch.Repository.GRepository;
using LawyerWatch.Repository.Interface;
using LawyerWatch.Repository.SPRepository;
using LawyerWatch.Repository.UnitofWork;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace LawyerWatch.Areas.Admin.Controllers
{
    public class SuperAdminController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly HttpCache _Cache = new HttpCache();
        private V1GeneralFunctions _V1Gen;

        private GenericRepository<AdminUsers> _AdminUsersRepo;

        private SpRepository _SpRepository;
        private SpRepositoryAdmin _SpRepositoryAdmin;

        public SuperAdminController()
        {
            _unitOfWork = new UnitOfWork();
            _V1Gen = new V1GeneralFunctions();
            _SpRepository = new SpRepository();
            _SpRepositoryAdmin = new SpRepositoryAdmin();

        }

        // GET: Admin/Users
        public ActionResult Index()
        {
            return View();
        }

        #region "Users"

        [HttpGet]
        public JsonResult GetUsers(string Search, int Pageindex, int Pagesize, string sortColumn, string sortOrder)
        {
            try
            {

                string _SearchText = Search;
                string _SortBy = "";
                _SortBy = " B." + sortColumn + " " + sortOrder;

                dynamic _list2 = _V1Gen.AFGetSuperUsers(_SearchText, _SortBy, Pageindex, Pagesize);

                Dictionary<string, object> d = new Dictionary<string, object>();


                if (_list2.Count > 0)
                {
                    d.Add("Items", _list2);
                    d.Add("PageCount", _list2[0].T_Pages);
                    d.Add("PageNumber", _list2[0].PageNo);
                    d.Add("PageSize", Pagesize);

                    return Json(d, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(d, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                //LogHelper.CreateLog(ex);
                return Json(new { message = ex.Message }, JsonRequestBehavior.AllowGet);

            }
        }

        public ActionResult updateuser(dynamic data)
        {
            try
            {
                var obj = JObject.Parse(data);
                var password = obj.Password.ToString();
                if (obj.Password != obj.ConfirmPassword)
                {
                    throw new Exception("Password and Confirm Password must be matched");
                }
                else if (!Regex.IsMatch(password, @"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$"))
                {
                    throw new Exception("Password must contain min 6 characters, At least 1 Alphabet, 1 Number,  1 Special Character");
                }
                else if (!LawyerWatch.Library.Utilities.Helper.IsValidEmail(obj.Email.ToString()))
                {
                    throw new Exception("Please enter valid email!");
                }
                _AdminUsersRepo = new GenericRepository<AdminUsers>(_unitOfWork);
                int userid = Convert.ToInt32(obj.UserID);
                if (userid > 0)
                {
                    var user = _AdminUsersRepo.Repository.Get(x => x.AdminUserId == userid);
                    user.RecordStatus = obj.RecordStatus;
                    user.ModifiedDate = DateTime.Now;
                    user.Email = obj.Email;
                    user.FirstName = obj.FirstName;
                    user.LastName = obj.LastName;
                    user.Password = AesCryptography.Encrypt(password);
                    user.Role = AdminUserRole.Admin.ToString();
                    _AdminUsersRepo.Repository.Update(user);
                    return Json(new { Status = true, RetMessage = "User updated successfully" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    _AdminUsersRepo.Repository.Add(new AdminUsers()
                    {
                        CreatedDate = DateTime.Now,
                        RecordStatus = obj.RecordStatus,
                        ModifiedDate = DateTime.Now,
                        Email = obj.Email,
                        FirstName = obj.FirstName,
                        LastName = obj.LastName,
                        Password = AesCryptography.Encrypt(obj.Password.ToString()),
                        Role = AdminUserRole.Admin.ToString()
                    });
                    return Json(new { Status = true, RetMessage = "User added successfully" }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new { Status = false, RetMessage = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetById(dynamic data)
        {
            try
            {
                _AdminUsersRepo = new GenericRepository<AdminUsers>(_unitOfWork);
                var obj = JObject.Parse(data);
                int userid = Convert.ToInt32(obj.UserID);
                var user = _AdminUsersRepo.Repository.Get(x => x.AdminUserId == userid);
                var model = new
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Password = AesCryptography.Decrypt(user.Password),
                    ConfirmPassword = AesCryptography.Decrypt(user.Password),
                    Email = user.Email,
                    RecordStatus = user.RecordStatus,
                    UserID = user.AdminUserId,
                    Role = user.Role
                };
                return Json(new { Status = true, Data = model, RetMessage = "User updated successfully" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, RetMessage = "Exception occured" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpDelete]
        public string Delete(int id)
        {
            id = Numerics.GetInt(id);
            if (id > 0)
            {
                AdminUsers _Users = null;
                GenericRepository<AdminUsers> _UsersRepo = new GenericRepository<AdminUsers>(_unitOfWork);

                _Users = _UsersRepo.Repository.Get(p => p.AdminUserId == id);

                if (_Users != null)
                {
                    _UsersRepo.Repository.Delete(_Users.AdminUserId);
                    return "true";
                }
                else
                {
                    return "false";
                }

            }
            else
            {
                return "false";
            }
        }

        #endregion
    }
}