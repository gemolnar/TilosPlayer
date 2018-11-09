using Microsoft.AspNetCore.Mvc;


namespace TilosPlayer.Website.Controllers
{

    public class CafController : Controller
    {
        public CafController()
        {
        }

        public IActionResult TilosReceiverApp()
        {
            return View();
        }
    }
}
