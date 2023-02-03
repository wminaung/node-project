const btn = document.querySelector(".btn");
const name = document.querySelector(".name");
const email = document.querySelector(".email");
const pwd = document.querySelector(".passward");
const list = document.querySelector(".list-group");
const input = document.querySelector("#inputGroupFile01");

const dataFromServer = async () => {
  const fetchData = await fetch("https://ok-service.onrender.com/users");
  const data = await fetchData.json();

  for (let i = 0; i < data.length; i++) {
    const divItem = document.createElement("div");
    divItem.classList.add("list-group-item", "mb-3");
    divItem.innerText = `${data[i].usrName} | ${data[i].usrEmail} | ${data[i].usrPwd}`;

    const spanDiv = document.createElement("span");
    const spanDiv2 = document.createElement("span");
    spanDiv.classList.add("spanOne");
    spanDiv2.classList.add("spanTwo");
    spanDiv.innerText = "Update";
    spanDiv2.innerText = "Delete";
    divItem.append(spanDiv, spanDiv2);
    list.append(divItem);

    spanDiv.addEventListener("click", () => {
      name.value = data[i].usrName;
      email.value = data[i].usrEmail;
      pwd.value = data[i].usrPwd;
      email.disabled = true;
      input.disabled = true;
    });

    const fetchForDelete = async () => {
      const fet = await fetch("https://ok-service.onrender.com/users", {
        method: "DELETE",
        body: JSON.stringify({
          usrName: data[i].usrName,
          usrEmail: data[i].usrEmail,
          usrPwd: data[i].usrPwd,
        }),
      });
    };

    spanDiv2.addEventListener("click", () => {
      fetchForDelete();
      divItem.style.display = "none";
    });
  }
};
dataFromServer();

let userData;
const registerUser = async () => {
  const response = await fetch("https://ok-service.onrender.com/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

btn.addEventListener("click", () => {
  list.innerHTML = "";
  const nameVal = name.value;
  const emailVal = email.value;
  const pwdVal = pwd.value;
  userData = {
    usrName: nameVal,
    usrEmail: emailVal,
    usrPwd: pwdVal,
    created: `${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`,
    updated: `${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`,
  };

  const fileuplaod = async () => {
    const fetchForFileupload = await fetch(
      "https://ok-service.onrender.com/fileupload",
      {
        method: "POST",
        body: input.files[0],
      }
    );

    console.log(await fetchForFileupload.json());
  };

  const fetchForUpdate = async () => {
    const fetcH = await fetch("https://ok-service.onrender.com/users");
    const fetchData = await fetcH.json();
    const emailThatIhave = fetchData.find((usr) => usr.usrEmail === emailVal);
    if (emailThatIhave) {
      await fetch("https://ok-service.onrender.com/users", {
        method: "PUT",
        body: JSON.stringify({
          newName: nameVal,
          usrEmail: emailVal,
          usrPwd: pwdVal,
          updated: new Date().toLocaleTimeString(),
        }),
      });
      dataFromServer();
      email.disabled = false;
      input.disabled = false;
    } else if (input.value > 0) {
      fileuplaod();
      registerUser();
      dataFromServer();
    } else {
      registerUser();
      dataFromServer();
    }
  };

  fetchForUpdate();

  name.value = "";
  email.value = "";
  pwd.value = "";
  name.focus();
});
