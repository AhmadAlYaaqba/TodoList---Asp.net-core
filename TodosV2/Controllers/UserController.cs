using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using TodosV2.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Principal;

namespace TodosV2.Controllers
{
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Identity.MongoDB;


    //[Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {

        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly JWTSettings _options;
        private readonly IConfiguration _config;

        public UserController(IConfiguration configuration, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager,IOptions<JWTSettings> optionsAccessor)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _options = optionsAccessor.Value;
            _config = configuration;
        }   
        // Get user Info ( If Login )
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        public async Task<IActionResult> GetUserInfoAsync()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity; //defined clamsIdentity to get saved username
            var user = await _userManager.FindByNameAsync(claimsIdentity.Name); // find user
            return Json(new RequestResult
            {
                State = RequestState.Success,
                Data = new { UserName = claimsIdentity.Name, Id = user.Id } // return both username and userID (will be saved in localStorge)
            });
        }

        // Create new User using JWT using POST request
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserParam model)
        {
            if (!ModelState.IsValid)
            {
                return Error("Unexpected error");
            }
            var user = new IdentityUser { UserName = model.UserName, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Json(new RequestResult
                {
                    State = RequestState.Success,
                    Data = new { Msg = "Account Created" }
                });
            }

            return Errors(result);

        }

        // Login with Token Generater
        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserParam model)
        {
            if (ModelState.IsValid)
            {
                // Get user data and check for password
                var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);
                // if signIn find complete user object and response with accessToken ( will be saved in localStorge in angular) to be used as header authentication
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(model.UserName);
                    var requestAt = DateTime.Now;
                    var expiresIn = requestAt + TokenAuthOption.ExpiresSpan;
                    var token = GenerateToken(user, expiresIn);

                    return Json(new RequestResult
                    {
                        State = RequestState.Success,
                        Data = new
                        {
                            requertAt = requestAt,
                            expiresIn = TokenAuthOption.ExpiresSpan.TotalSeconds,
                            tokeyType = TokenAuthOption.TokenType,
                            accessToken = token
                        }
                    });
                }
            }
            // if get to here, somthing went wrong with signIn 
            return Json(new RequestResult
            {
                State = RequestState.Failed,
                Msg = "Username or password is invalid"
            });
        }
        // All helpers functions
        // Generate JWT token
        private string GenerateToken(IdentityUser user, DateTime expires)
        {
            var handler = new JwtSecurityTokenHandler();

            ClaimsIdentity identity = new ClaimsIdentity(
                new GenericIdentity(user.UserName, "TokenAuth"),
                new[] { new Claim("ID", user.Id.ToString()) }
            );

            var securityToken = handler.CreateToken(new SecurityTokenDescriptor
            {
                Issuer = TokenAuthOption.Issuer,
                Audience = TokenAuthOption.Audience,
                SigningCredentials = TokenAuthOption.SigningCredentials,
                Subject = identity,
                Expires = expires
            });
            return handler.WriteToken(securityToken);
        }

        private JsonResult Errors(IdentityResult result)
        {
            var items = result.Errors
                .Select(x => x.Description)
                .ToArray();
            return new JsonResult(items) { StatusCode = 200 };
        }

        private JsonResult Error(string message)
        {
            return new JsonResult(message) { StatusCode = 400 };
        }

        private static double ConvertToUnixTimestamp(DateTime date)
        {
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            TimeSpan diff = date.ToUniversalTime() - origin;
            return Math.Floor(diff.TotalSeconds);
        }

    }
}