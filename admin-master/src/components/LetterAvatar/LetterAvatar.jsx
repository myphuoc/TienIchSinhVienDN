import React, { Component } from "react";
import "./LetterAvatar.css";
class LetterAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultWidth: "100%",
      defaultHeight: "auto",
      defaultAvatar: "User Name",
    };
  }

  letterAvatar = (name, size = 200) => {
    name = name || "";

    var colours = [
        "#1abc9c",
        "#2ecc71",
        "#3498db",
        "#9b59b6",
        "#34495e",
        "#16a085",
        "#27ae60",
        "#2980b9",
        "#8e44ad",
        "#2c3e50",
        "#f1c40f",
        "#e67e22",
        "#e74c3c",
        "#0037ff",
        "#95a5a6",
        "#f39c12",
        "#d35400",
        "#c0392b",
        "#bdc3c7",
        "#7f8c8d",
      ],
      nameSplit = String(name)
        .toUpperCase()
        .split(" "),
      initials,
      charIndex,
      colourIndex,
      canvas,
      context,
      dataURI;

    if (nameSplit.length === 1) {
      initials = nameSplit[0] ? nameSplit[0].charAt(0) : "?";
    } else {
      initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    }

    if (window.devicePixelRatio) {
      size = size * window.devicePixelRatio;
    }

    charIndex = (initials === "?" ? 72 : initials.charCodeAt(0)) - 64;
    colourIndex = charIndex % 20;
    canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    context = canvas.getContext("2d");

    context.fillStyle = this.props.color
      ? this.props.color
      : colours[colourIndex - 1];
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "bold " + Math.round(canvas.width / 2) + "px Arial";
    context.textAlign = "center";
    context.fillStyle = "#FFF";
    context.fontWeight = "bold";
    context.fillText(initials, size / 2, size / 1.5);

    dataURI = canvas.toDataURL();
    canvas = null;

    return dataURI;
  };

  transformAvatar = (e) => {
    const name = e.target.attributes.getNamedItem("avatar").value;
    e.target.src = this.letterAvatar(name, this.props.size);
  };

  render() {
    const { src, userName, width, height, className } = this.props;
    const { defaultWidth, defaultHeight, defaultAvatar } = this.state;

    return (
      <>
        <img
          key={userName}
          src={src}
          className={"letter-avatar round " + className}
          width={width ? width : defaultWidth}
          height={height ? height : defaultHeight}
          avatar={userName ? userName : defaultAvatar}
          alt="agc"
          onError={(e) => {
            this.transformAvatar(e);
          }}
        />
      </>
    );
  }
}

export default LetterAvatar;
