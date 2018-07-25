using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization; 
using reacttutorial.Models;

namespace reacttutorial.Controllers
{
    public class DefaultController : Controller
    {
        // GET: Default
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetCustomers()
        {
            using( var db = new onboardingEntities())
            {
                var result = db.Customers.Select(x => new { Id = x.Id, Name = x.Name, Address = x.Address }).ToList();
                if (result != null)
                {
                    return Json(new { Success = true, result }, JsonRequestBehavior.AllowGet );
                }
                else
                {
                    return Json(new { Success = false, Message = "Customer Details not found"}, JsonRequestBehavior.AllowGet);
                }
            }
        }

        [HttpPost]
        public JsonResult DeleteCustomer(Customer customer)
        {
            using (var db = new onboardingEntities())
            {
                var result = db.Customers.Where(x => x.Id == customer.Id).FirstOrDefault();
                if (result != null)
                {
                    try
                    {
                        db.Customers.Remove(result);
                        db.SaveChanges();
                        return Json(new { Success = true, Message = "Customer Deleted successfully" }, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception e)
                    {
                        return Json(new { Success = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { Success = true, Message = "No Customer Id found in table" }, JsonRequestBehavior.AllowGet);
                }
                
            }
        }

        [HttpPost]
        public JsonResult EditCustomer(Customer customer)
        {
            using(var db = new onboardingEntities())
            {
                
                var result = db.Customers.Where(x => x.Id == customer.Id).FirstOrDefault();
                if (result != null)
                {
                    try
                    {
                        result.Name = customer.Name;
                        result.Address = customer.Address;
                        db.SaveChanges();
                        return Json(new { Success = true, Message = "Updated Successfully"}, JsonRequestBehavior.AllowGet);
                    }
                    catch (Exception e)
                    {
                        return Json(new { Success = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json("No result found with this id", JsonRequestBehavior.AllowGet);
                }

                
            }
        }

        [HttpPost]
        public JsonResult AddCustomer(Customer customer)
        {
            using (var db = new onboardingEntities())
            {
                var CustomerDetails = new Customer
                {
                    Name = customer.Name,
                    Address = customer.Address
                };
                var customers = db.Set<Customer>();
                try
                {
                    customers.Add(CustomerDetails);
                    db.SaveChanges();
                    return Json("Customer Details are saved successfully!", JsonRequestBehavior.AllowGet);
                }
                catch(Exception e)
                {
                    return Json("Error saving to db"+ e.InnerException + e.Message, JsonRequestBehavior.AllowGet);
                }

            }
        }
    }
}