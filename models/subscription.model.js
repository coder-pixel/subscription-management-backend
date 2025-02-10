import mongoose, { Schema } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "INR"], // setting allowed values
      default: "INR",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"], // enum for frequency
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "lifestyle",
        "technology",
        "finance",
        "politics",
        "other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(), // validator fn for validation check
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // validator fn for validation check
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      // refernce to USER model via ID
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // to optimize the queries by indexing the User ID's
    },
  },
  { timestamps: true }
);

// this fn would be called everytime before creating a Subscription model
// this will auto-calculate the renewal date based on the startDate and renewal period
SubscriptionSchema.pre("save", (next) => {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    // basically we are adding 'frequency' no of days to the startDate to get the renewal date
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }

  // Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

// creatimg a user model for all the interactions
const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
