import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "./color";
import { TextInput } from "react-native-gesture-handler";
import Icon from "./Icons/Icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  baseUrl,
  RegistrationApi,
  coursenameApi,
  departmentnameApi,
  listindustriesApi,
} from "./baseURL/api";
import { useNavigation } from "@react-navigation/native";
import { showError, showSuccess } from "./components/Toast";
import { useTheme } from "../theme/ThemeContext";
import {
  registrationbackgroundimage,
  registrationlogoimage,
  registrationtopTextImage,
  registrationtopTextImage_dark,
  universityFullName,
} from "../constants";
import KeyboardAvoidingWrapper from "./components/KeyboardAvoidingWrapper";

const Registration = () => {
  const navigation = useNavigation();
  const { isDark, colors, toggleTheme } = useTheme();
  const [selectedGender, setSelectedGender] = useState("male");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedRole, setSelectedRole] = useState("Student");
  const [courseList, setCourseList] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industryList, setIndustryList] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [errors, setErrors] = useState({});
  const [checked, setChecked] = useState(false);
  const { width, height } = Dimensions.get("window");
  const [isModalVisible, setModalVisible] = useState(false);
  const handleRegistrationSuccess = () => {
    setModalVisible(true); // Show the modal after successful registration
  };
  const navigateToLogin = () => {
    setModalVisible(false); // Close the modal
    navigation.navigate("Login"); // Navigate to the Login screen
  };
  const roleTypeMap = {
    Student: 1,
    Faculty: 2,
    Alumni: 3,
    "Industry Professional": 4,
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const passingyears =
    selectedRole == "Alumni"
      ? Array.from({ length: 100 }, (_, i) => currentYear - i)
      : Array.from({ length: 8 }, (_, i) => 2023 + i);
  const startYear = currentYear - 10;
  const years = Array.from({ length: 100 }, (_, i) => startYear - i);

  const [searchQuery, setSearchQuery] = useState("");

  const renderOptions = (data, onSelect) => (
    <ScrollView style={styles.modalContent}>
      {data.map((item, index) => {
        // const label = typeof item === 'object' ? item.Name : item;
        const label =
          typeof item === "object" ? item.Name || item.DepartmentName : item;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onSelect(item);
              setCurrentPicker(null);
            }}
          >
            <Text
              style={{
                ...styles.optionText,
                borderColor: colors.textinputbordercolor,
                color: colors.textColor,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchIndustries();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${baseUrl}${coursenameApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "" }),
      });
      const data = await response.json();
      if (data.Status === 1) {
        setCourseList(data.DataList);
      } else {
        console.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseUrl}${departmentnameApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.Status === 1) {
        setDepartmentList(data.DataList);
      } else {
        console.error("Failed to fetch departments");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  const fetchIndustries = async () => {
    try {
      const response = await fetch(`${baseUrl}${listindustriesApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      // console.log(data, "datadatadatadatadatadatadatadata");

      if (data.Status === 1) {
        setIndustryList(data.DataList);
      } else {
        console.error("Failed to fetch Industries");
      }
    } catch (error) {
      console.error("Error fetching Industries:", error);
    }
  };
  const validateForm = () => {
    let tempErrors = {};

    // ---------- BASIC DETAILS ----------
    if (!firstName.trim()) {
      tempErrors.firstName = true;
      showError("First name is required");
      setErrors(tempErrors);
      return false;
    }

    if (!lastName.trim()) {
      tempErrors.lastName = true;
      showError("Last name is required");
      setErrors(tempErrors);
      return false;
    }

    if (!email.trim()) {
      tempErrors.email = true;
      showError("Email is required");
      setErrors(tempErrors);
      return false;
    }
    if (!isValidEmail(email)) {
      tempErrors.email = true;
      showError("Invalid email format");
      setErrors(tempErrors);
      return false;
    }
    if (!phone.trim() || phone.length !== 10) {
      tempErrors.phone = true;
      showError("Valid 10-digit phone number required");
      setErrors(tempErrors);
      return false;
    }

    // ---------- BIRTHDAY ----------
    if (!selectedDay) {
      tempErrors.day = true;
      showError("Please select birth day");
      setErrors(tempErrors);
      return false;
    }

    if (!selectedMonth) {
      tempErrors.month = true;
      showError("Please select birth month");
      setErrors(tempErrors);
      return false;
    }

    if (!selectedYear) {
      tempErrors.year = true;
      showError("Please select birth year");
      setErrors(tempErrors);
      return false;
    }

    // ---------- GENDER ----------
    if (!selectedGender) {
      tempErrors.gender = true;
      showError("Please select gender");
      setErrors(tempErrors);
      return false;
    }

    // ---------- ROLE ----------
    if (!selectedRole) {
      tempErrors.role = true;
      showError("Please select role");
      setErrors(tempErrors);
      return false;
    }

    // ---------- ROLE-BASED VALIDATION ----------
    // Faculty
    if (selectedRole === "Faculty" && !selectedDepartment) {
      tempErrors.department = true;
      showError("Please select department");
      setErrors(tempErrors);
      return false;
    }

    // Industry Professional
    if (selectedRole === "Industry Professional" && !selectedIndustry) {
      tempErrors.industry = true;
      showError("Please select industry");
      setErrors(tempErrors);
      return false;
    }
    if (
      selectedRole !== "Faculty" &&
      selectedRole !== "Industry Professional"
    ) {
      if (!selectedCourse) {
        tempErrors.course = true;
        showError("Please select course");
        setErrors(tempErrors);
        return false;
      }

      if (!selectedDepartment) {
        tempErrors.department = true;
        showError("Please select department");
        setErrors(tempErrors);
        return false;
      }

      if (!passingYear) {
        tempErrors.passingYear = true;
        showError("Please select passing year");
        setErrors(tempErrors);
        return false;
      }
    }

    // Alumni + Industry Professional require Job + Company
    if (selectedRole === "Alumni" || selectedRole === "Industry Professional") {
      if (!jobTitle.trim()) {
        tempErrors.jobTitle = true;
        showError("Job title is required");
        setErrors(tempErrors);
        return false;
      }

      if (!companyName.trim()) {
        tempErrors.companyName = true;
        showError("Company name is required");
        setErrors(tempErrors);
        return false;
      }
    }
    // ---------- TERMS & CONDITIONS ----------
    if (!checked) {
      tempErrors.checked = true;
      showError("You must accept the terms and conditions");
      setErrors(tempErrors);
      return false;
    }
    setErrors({});
    return true;
  };
  const handleRegister = async () => {
    // if (!email) {
    //   // showError("Email is required");
    //   return;
    // }
    // if (!isValidEmail(email)) {
    //   showError("Please enter a valid email address");
    //   return;
    // }
    if (!validateForm()) return;
    const payload = {
      firstName,
      lastName,
      email,
      mobile: phone,
      password: "r00t@12345",
      day: selectedDay,
      month: months.indexOf(selectedMonth) + 1,
      year: selectedYear,
      gender:
        selectedGender === "male"
          ? "Male"
          : selectedGender === "female"
          ? "Female"
          : "Other",
      userstype: roleTypeMap[selectedRole],
      employmentId: 101,
      membershipId: 2001,
      templateId: 123,
      jobTitle: jobTitle || "Null",
      passingyear: parseInt(passingYear) || 0,
      departmentname: selectedDepartment?.DepartmentName || "Null",
      companyName: companyName || "SGT VECOSPACE",
      industryId: selectedIndustry?.Id || 1,
      countryName: "India",
      cityName: "Delhi",
      locationName: "South Extension",
      userurl: `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Date.now()}`,
      taglineText: "Passionate Developer",
      ppAndTcStatus: "1",
      onlineDateTime: "2025-03-18 12:00:00",
      serviceOffered: 3,
      jobSkills: "PHP, Laravel, MySQL",
      experienceLevel: "Mid-Level",
      professionalTitle: "Software Developer",
      professionalBrief: "Experienced in Laravel and API Development",
      freelancerStatus: 1,
      freelancerRegDate: 20240318,
      lastPost: 5,
      passStatus: "A",
      onlineLastUpdate: 1710763200,
      resetPasswordTime: 1710763200,
      regDate: 1710763200,
      timeZone: "Asia/Kolkata",
      backgroundPhoto: "background-image.png",
      coursename: selectedCourse?.Name || "Null",
      numberofMentees: 10,
      profilePhoto: null,
    };
    console.log(payload, "payloadpayloadpayloadpayloadpayload");
    try {
      const response = await fetch(`${baseUrl}${RegistrationApi}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("Server response:", result);
      if (response.ok) {
        showSuccess("Registration successful!");
        // navigation.navigate("Login");
        handleRegistrationSuccess();
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Network error. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingWrapper offset={40}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <Image
              source={registrationlogoimage}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
            <Image
              source={
                isDark
                  ? registrationtopTextImage_dark
                  : registrationtopTextImage
              }
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />
          </View>

          <ImageBackground
            source={registrationbackgroundimage}
            resizeMode="cover"
            style={{
              flex: 1,
              justifyContent: "center",
              paddingVertical: 40,
            }}
          >
            <View
              style={{
                ...styles.whiteBox,
                backgroundColor: colors.cardBackground,
              }}
            >
              <Text
                style={{ ...styles.registerText, color: colors.AppmainColor }}
              >
                Register Now !!!
              </Text>
              <View style={styles.nameBox}>
                <TextInput
                  style={{
                    ...styles.inputText,
                    borderColor: errors.firstName
                      ? "red"
                      : colors.textinputbordercolor,
                    color: colors.textColor,
                  }}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    setErrors({ ...errors, firstName: null });
                  }}
                  placeholder="First name"
                  placeholderTextColor={colors.placeholderTextColor}
                />
                <TextInput
                  style={{
                    ...styles.inputText,
                    borderColor: errors.lastName
                      ? "red"
                      : colors.textinputbordercolor,
                    color: colors.textColor,
                  }}
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    setErrors({ ...errors, lastName: null });
                  }}
                  placeholder="Last name"
                  placeholderTextColor={colors.placeholderTextColor}
                />
              </View>
              <TextInput
                style={{
                  ...styles.emailTextInput,
                  borderColor: errors.email
                    ? "red"
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                }}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: null });
                }}
                placeholder="Email"
                placeholderTextColor={colors.placeholderTextColor}
              />
              <TextInput
                maxLength={10}
                keyboardType="numeric"
                style={{
                  ...styles.emailTextInput,
                  borderColor: errors.phone
                    ? "red"
                    : colors.textinputbordercolor,
                  color: colors.textColor,
                }}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setErrors({ ...errors, phone: null });
                }}
                placeholder="Phone "
                placeholderTextColor={colors.placeholderTextColor}
              />
              <Text style={{ ...styles.birthdayText, color: colors.textColor }}>
                Birthday
              </Text>
              <View style={styles.birthdayBox}>
                <TouchableOpacity
                  style={{
                    ...styles.dayBox,
                    borderColor: errors.day
                      ? "red"
                      : colors.textinputbordercolor,
                  }}
                  onPress={() => setCurrentPicker("day")}
                >
                  <Text style={{ ...styles.dayText, color: colors.textColor }}>
                    {selectedDay || "Day"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.dayBox,
                    borderColor: errors.month
                      ? "red"
                      : colors.textinputbordercolor,
                  }}
                  onPress={() => setCurrentPicker("month")}
                >
                  <Text style={{ ...styles.dayText, color: colors.textColor }}>
                    {selectedMonth || "Month"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCurrentPicker("year")}
                  style={{
                    ...styles.dayBox,
                    borderColor: errors.year
                      ? "red"
                      : colors.textinputbordercolor,
                  }}
                >
                  <Text style={{ ...styles.dayText, color: colors.textColor }}>
                    {selectedYear || "Year"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.maleMainBox}>
                <TouchableOpacity
                  style={styles.maleBox}
                  onPress={() => setSelectedGender("male")}
                >
                  <View
                    style={{
                      ...styles.maleCircleBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    {selectedGender === "male" && (
                      <View
                        style={{
                          ...styles.selectedCircle,
                          backgroundColor: colors.AppmainColor,
                        }}
                      />
                    )}
                  </View>
                  <Text style={{ ...styles.maleText, color: colors.textColor }}>
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.maleBox}
                  onPress={() => setSelectedGender("female")}
                >
                  <View
                    style={{
                      ...styles.maleCircleBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    {selectedGender === "female" && (
                      <View
                        style={{
                          ...styles.selectedCircle,
                          backgroundColor: colors.AppmainColor,
                        }}
                      />
                    )}
                  </View>
                  <Text style={{ ...styles.maleText, color: colors.textColor }}>
                    Female
                  </Text>
                </TouchableOpacity>
                {/* <View></View> */}
                <TouchableOpacity
                  style={styles.maleBox}
                  onPress={() => setSelectedGender("Others")}
                >
                  <View
                    style={{
                      ...styles.maleCircleBox,
                      borderColor: colors.textinputbordercolor,
                    }}
                  >
                    {selectedGender === "Others" && (
                      <View
                        style={{
                          ...styles.selectedCircle,
                          backgroundColor: colors.AppmainColor,
                        }}
                      />
                    )}
                  </View>
                  <Text style={{ ...styles.maleText, color: colors.textColor }}>
                    Others
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.studentMainBox}>
                <TouchableOpacity
                  onPress={() => setCurrentPicker("role")}
                  style={{
                    ...styles.StudentBox,
                    borderColor: colors.textinputbordercolor,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ ...styles.StudentText, color: colors.textColor }}
                  >
                    {selectedRole ? selectedRole : "Select Role"}
                  </Text>
                  <Icon
                    name="down"
                    type="AntDesign"
                    size={15}
                    color={colors.placeholderTextColor}
                  />
                </TouchableOpacity>

                {selectedRole == "Faculty" && (
                  <TouchableOpacity
                    onPress={() => setCurrentPicker("department")}
                    style={{
                      ...styles.StudentBox,
                      borderColor: errors.department
                        ? "red"
                        : colors.textinputbordercolor,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ ...styles.StudentText, color: colors.textColor }}
                    >
                      {selectedDepartment
                        ? selectedDepartment.DepartmentName
                        : "Department"}
                    </Text>
                    <Icon
                      name="down"
                      type="AntDesign"
                      size={15}
                      color={colors.placeholderTextColor}
                      // style={{right: 6}}
                    />
                  </TouchableOpacity>
                )}
                {selectedRole == "Industry Professional" && (
                  <TouchableOpacity
                    onPress={() => setCurrentPicker("Industry")}
                    style={{
                      ...styles.StudentBox,
                      borderColor: errors.industry
                        ? "red"
                        : colors.textinputbordercolor,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ ...styles.StudentText, color: colors.textColor }}
                    >
                      {selectedIndustry ? selectedIndustry.Name : "Industry"}
                    </Text>
                    <Icon
                      name="down"
                      type="AntDesign"
                      size={15}
                      color={colors.placeholderTextColor}
                      // style={{right: 6}}
                    />
                  </TouchableOpacity>
                )}

                {selectedRole !== "Faculty" &&
                  selectedRole !== "Industry Professional" && (
                    <TouchableOpacity
                      onPress={() => setCurrentPicker("course")}
                      style={{
                        ...styles.StudentBox,
                        borderColor: errors.course
                          ? "red"
                          : colors.textinputbordercolor,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          ...styles.StudentText,
                          color: colors.textColor,
                        }}
                      >
                        {selectedCourse ? selectedCourse.Name : "Course"}
                      </Text>
                      <Icon
                        name="down"
                        type="AntDesign"
                        size={15}
                        color={colors.placeholderTextColor}
                      />
                    </TouchableOpacity>
                  )}
              </View>
              {selectedRole !== "Faculty" &&
                selectedRole !== "Industry Professional" && (
                  <View style={styles.studentMainBox}>
                    <TouchableOpacity
                      onPress={() => setCurrentPicker("department")}
                      style={{
                        ...styles.StudentBox,
                        borderColor: errors.department
                          ? "red"
                          : colors.textinputbordercolor,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          ...styles.StudentText,
                          color: colors.textColor,
                        }}
                      >
                        {selectedDepartment
                          ? selectedDepartment.DepartmentName
                          : "Department"}
                      </Text>
                      <Icon
                        name="down"
                        type="AntDesign"
                        size={15}
                        color={colors.placeholderTextColor}
                        // style={{right: 6}}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setCurrentPicker("passingYear")}
                      style={{
                        ...styles.StudentBox,
                        borderColor: errors.passingYear
                          ? "red"
                          : colors.textinputbordercolor,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          ...styles.StudentText,
                          color: colors.textColor,
                        }}
                      >
                        {passingYear ? passingYear : "Passing Year"}
                      </Text>
                      <Icon
                        name="down"
                        type="AntDesign"
                        size={15}
                        color={colors.placeholderTextColor}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              {selectedRole == "Alumni" && (
                <>
                  <View style={styles.nameBox}>
                    <TextInput
                      style={{
                        ...styles.inputText,
                        borderColor: errors.jobTitle
                          ? "red"
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                      }}
                      value={jobTitle}
                      onChangeText={(text) => {
                        setJobTitle(text);
                        setErrors({ ...errors, jobTitle: null });
                      }}
                      placeholder="Enter Job Title"
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                    <TextInput
                      style={{
                        ...styles.inputText,
                        borderColor: errors.companyName
                          ? "red"
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                      }}
                      value={companyName}
                      onChangeText={(text) => {
                        setCompanyName(text);
                        setErrors({ ...errors, companyName: null });
                      }}
                      placeholder="Company Name"
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                  </View>

                  <View style={styles.studentMainBox}>
                    <TouchableOpacity
                      onPress={() => setCurrentPicker("Industry")}
                      style={{
                        ...styles.StudentBox,
                        borderColor: errors.industry
                          ? "red"
                          : colors.textinputbordercolor,
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          ...styles.StudentText,
                          color: colors.textColor,
                        }}
                      >
                        {selectedIndustry ? selectedIndustry.Name : "Industry"}
                      </Text>
                      <Icon
                        name="down"
                        type="AntDesign"
                        size={15}
                        color={colors.placeholderTextColor}
                        // style={{right: 6}}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {selectedRole == "Industry Professional" && (
                <>
                  <View style={styles.nameBox}>
                    <TextInput
                      style={{
                        ...styles.inputText,
                        borderColor: errors.jobTitle
                          ? "red"
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                      }}
                      value={jobTitle}
                      onChangeText={(text) => {
                        setJobTitle(text);
                        setErrors({ ...errors, jobTitle: null });
                      }}
                      placeholder="Enter Job Title"
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                    <TextInput
                      style={{
                        ...styles.inputText,
                        borderColor: errors.companyName
                          ? "red"
                          : colors.textinputbordercolor,
                        color: colors.textColor,
                      }}
                      value={companyName}
                      onChangeText={(text) => {
                        setCompanyName(text);
                        setErrors({ ...errors, companyName: null });
                      }}
                      placeholder="Company Name"
                      placeholderTextColor={colors.placeholderTextColor}
                    />
                  </View>
                </>
              )}
              {selectedRole !== "Industry Professional" && (
                <TextInput
                  // numberOfLines={1}
                  // ellipsizeMode="tail"
                  editable={false}
                  style={{
                    ...styles.jamiaTextInput,
                    borderColor: colors.textinputbordercolor,
                    width: "100%",
                  }}
                  placeholder="Shree Guru Gobind Singh Tricentenary VECOSPACE"
                  placeholderTextColor={colors.placeholderTextColor}
                />
              )}
              <View style={styles.tickTextBox}>
                <TouchableOpacity onPress={() => setChecked(!checked)}>
                  <MaterialCommunityIcons
                    name={
                      checked ? "checkbox-marked" : "checkbox-blank-outline"
                    }
                    size={24}
                    color={colors.AppmainColor}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 14,
                    flexShrink: 1,
                    color: colors.textColor,
                  }}
                >
                  I accept {universityFullName}'s{" "}
                  <Text
                    onPress={() => navigation.navigate("TermsScreen")}
                    style={{
                      fontSize: 14,
                      flexShrink: 1,
                      color: colors.AppmainColor,
                    }}
                  >
                    Terms & Conditions
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleRegister}
                style={{
                  alignItems: "center",
                  backgroundColor: colors.AppmainColor,
                  marginHorizontal: 12,
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 20,
                }}
              >
                <Text style={{ fontSize: 18, color: colors.ButtonTextColor }}>
                  Register Now
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              padding: 6,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("PrivacyScreen")}
            >
              <Text style={{ color: colors.textColor }}>Privacy</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 6, color: colors.textColor }}>
              |
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("TermsScreen")}
            >
              <Text style={{ color: colors.textColor }}>Terms</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 6, color: colors.textColor }}>
              |
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("AboutScreen")}
            >
              <Text style={{ color: colors.textColor }}>About</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 6, color: colors.textColor }}>
              |
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("ContactUsScreen")}
            >
              <Text style={{ color: colors.textColor }}>Contact Us</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 6, color: colors.textColor }}>
              |
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("FAQScreen")}>
              <Text style={{ color: colors.textColor }}>FAQ's</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
      <Modal visible={!!currentPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={{
              ...styles.modalBox,
              backgroundColor: colors.modelBackground,
            }}
          >
            {(currentPicker === "course" || currentPicker === "department") && (
              <TextInput
                // style={styles.searchInput}
                placeholder={`Search ${currentPicker}`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  borderWidth: 1,
                  borderColor: colors.textinputbordercolor,
                  borderRadius: 8,
                  padding: 8,
                  margin: 10,
                  color: colors.textColor,
                }}
                placeholderTextColor={colors.placeholderTextColor}
              />
            )}
            {currentPicker === "day" && renderOptions(days, setSelectedDay)}
            {currentPicker === "month" &&
              renderOptions(months, setSelectedMonth)}
            {currentPicker === "year" && renderOptions(years, setSelectedYear)}
            {currentPicker === "passingYear" &&
              renderOptions(passingyears, setPassingYear)}
            {currentPicker === "role" &&
              renderOptions(
                ["Student", "Faculty", "Alumni", "Industry Professional"],
                setSelectedRole,
              )}
            {/* {currentPicker === 'course' &&
              renderOptions(courseList, setSelectedCourse)}
            {currentPicker === 'department' &&
              renderOptions(departmentList, setSelectedDepartment)} */}
            {currentPicker === "Industry" &&
              renderOptions(
                industryList.filter(
                  (c) =>
                    c?.Name &&
                    c.Name.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
                (c) => {
                  setSelectedIndustry(c);
                  setCurrentPicker(null);
                  setSearchQuery("");
                },
              )}
            {currentPicker === "course" &&
              renderOptions(
                courseList.filter(
                  (c) =>
                    c?.Name &&
                    c.Name.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
                (c) => {
                  setSelectedCourse(c);
                  setCurrentPicker(null);
                  setSearchQuery("");
                },
              )}

            {currentPicker === "department" &&
              renderOptions(
                departmentList.filter(
                  (d) =>
                    d?.DepartmentName &&
                    d.DepartmentName.toLowerCase().includes(
                      searchQuery.toLowerCase(),
                    ),
                ),
                (d) => {
                  setSelectedDepartment(d);
                  setCurrentPicker(null);
                  setSearchQuery("");
                },
              )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setCurrentPicker(null), setSearchQuery("");
              }}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        animationType="slide"
        visible={isModalVisible}
        backdropOpacity={0.5}
        style={{ justifyContent: "center", alignItems: "center", margin: 0 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: width * 0.9, // 90% of screen width
              maxHeight: height * 0.6, // max 60% of screen height
              backgroundColor: colors.modelBackground,
              borderRadius: 15,
              padding: 20,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            {/* Title */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                marginBottom: 15,
                color: colors.textColor,
                textAlign: "center",
              }}
            >
              Registration Successful!
            </Text>

            {/* Description */}
            <Text
              style={{
                fontSize: 16,
                color: colors.textColor,
                textAlign: "center",
                marginBottom: 20,
                lineHeight: 20,
              }}
            >
              We’ve sent you an email to confirm your registration on{" "}
              {universityFullName}. Please open the email and follow the steps
              to complete your registration.
              {"\n\n"}
              If you can’t find email, check your Spam,Promotions, or Other
              folders.
            </Text>

            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              {/* Back to Login Button */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginRight: 10,
                  backgroundColor: colors.AppmainColor,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={navigateToLogin}
              >
                <Text
                  style={{
                    color: "#fff", // Button text color
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  whiteBox: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%",
  },
  registerText: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
  },
  inputText: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginTop: 8,
  },
  nameBox: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
  },
  emailTextInput: {
    height: 40,
    paddingVertical: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  birthdayText: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
  },
  birthdayBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayBox: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  dayText: { fontSize: 14, fontWeight: "400" },
  maleMainBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  maleBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  maleCircleBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  selectedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  maleText: {
    fontSize: 16,
  },
  studentMainBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  StudentBox: {
    width: "48%",
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  StudentText: {
    fontSize: 16,
  },
  jamiaTextInput: {
    height: "7%",
    width: "60%",
    // paddingVertical: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  tickTextBox: {
    flexDirection: "row",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalBox: {
    borderRadius: 8,
    maxHeight: "70%",
  },
  modalContent: {
    // padding: 20,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  cancelButton: {
    backgroundColor: "#333",
    padding: 12,
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
