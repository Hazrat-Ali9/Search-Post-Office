let ip_text = document.getElementById("ip");
let ip_address = document.getElementById("ip_address");
let lat = document.getElementById("lat");
let city = document.getElementById("city");
let hostname = document.getElementById("hostname");
let oraganisation = document.getElementById("organisation");
let region = document.getElementById("region");
let long = document.getElementById("long");
let iframe = document.getElementById("ifram");
let listOfPostOffice = document.getElementById("post_office_wrapper");
let input_search = document.getElementById("search_post");
let timeZone = document.getElementById("time_zone");
let dateTime = document.getElementById("date_time");
let pincode = document.getElementById("pincode");
let message = document.getElementById("message");

document.getElementById("btn").addEventListener("click", () => {
  document.getElementById("first").style.display = "none";
  document.getElementById("render").style.display = "block";
});

let ip;
$(document).ready(() => {
  $.getJSON("https://api.ipify.org?format=json", function (data) {
    // Displayin IP address on screen
    ip = data.ip;
    ipCall(ip);
    $("#ip").html(data.ip);
  });
});

async function ipCall(IP) {
  try {
    let res = await fetch(`https://ipapi.co/${IP}/json/`);
    let result = await res.json();
    ip_address.innerText = result.ip ?? "";
    lat.innerHTML = result.latitude ?? "";
    city.innerHTML = result.city ?? "";
    oraganisation.innerHTML = result.org ?? "";
    long.innerHTML = result.longitude ?? "";
    region.innerHTML = result.region ?? "";
    hostname.innerHTML = result.asn ?? "";
    timeZone.innerText = result.timezone ?? "";
    dateTime.innerHTML = new Date().toLocaleString("en-US", {
      timeZone: result.timezone ?? "",
    });
    pincode.innerText = result.postal ?? "";
    message.innerText = `${result.city} ${result.region} ${result.country_name}`;
    iframe.setAttribute(
      "src",
      `https://maps.google.com/maps?q=${result.latitude}, ${result.longitude}&z=15&output=embed`
    );

    fetchListOfPostOffice(result?.postal ?? "");
  } catch (error) {
    console.log(error);
  }
}

let postOfficeData;
async function fetchListOfPostOffice(pincode) {
  try {
    let res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    let result = await res.json();
    let data = result[0]?.PostOffice ?? [];
    postOfficeData = data;

    listOfPostOffice.innerHTML = listOfPostOfficeElement(data);
  } catch (error) {
    console.log(error);
  }
}

function listOfPostOfficeElement(data) {
  return data
    .map((val) => {
      return ` <div class="postoffice_box">
  <div class="pincode_box">
  <div class="list_item" >
  <p>Name</p> : <span  id="name">${val?.Name ?? ""} - ${
        val?.Pincode ?? ""
      }</span>
  </div>
  <div class="list_item" >
  <p>Branch Type</p> : <span id="branchtype">${val?.BranchType ?? ""}</span>
  </div>
  <div class="list_item" >
  <p>Delivery Status</p> :  <span id="deliveryStatus">${
    val?.District ?? ""
  }</span>
  </div>
  <div class="list_item" >
  <p>District</p> :   <span id="district">${val?.District ?? ""}</span>
  </div>
      
  <div class="list_item" >
  <p>Division</p> :  <span id="division">${val?.Division ?? ""}</span>
  </div>
       
  </div>
</div>`;
    })
    .join("");
}

input_search.addEventListener("keyup", filterSearchData);
function filterSearchData() {
  let data = postOfficeData;
  let value = input_search.value;
  let filterData = data.filter((val) =>
    val.Name.toLowerCase().includes(value.toLowerCase())
  );
  listOfPostOffice.innerHTML = listOfPostOfficeElement(filterData ?? []);
  console.log(value, filterData, "input_search");
}
