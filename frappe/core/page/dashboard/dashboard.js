frappe.pages['dashboard'].on_page_load = function(wrapper) {
	var me = this
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Dashboard',
		single_column: true
	})

	$(`<div class="dashboard page-main-content">
		<div id="dashboard-graph"></div>
	</div>`).appendTo(this.page.main)

	this.timespans = ["Last Week", "Last Month", "Last Quarter", "Last Year"];
	this.timegrains = ["Daily", "Weekly", "Monthly", "Quarterly"];
	this.filters = {
		timespan: "Last Week",
		timegrain: "Daily",
		account: "Cash - GTPL",
	}

	this.account_select = this.page.add_field({
		fieldname: "account",
		label: __("Account"),
		fieldtype: "Link",
		options: "Account",
		get_query: {
			doctype: "Account",
			filters: {
				company: "Gadget Technologies Pvt. Ltd.",
			}
		}
	}).$wrapper.find("input")

	this.timespan_select = this.page.add_select(__("Time Span"),
		this.timespans.map(d => {
			return {"label": __(d), value: d }
		})
	)

	this.timegrain_select = this.page.add_select(__("Time Grain"),
		this.timegrains.map(d => {
			return {"label": __(d), value: d }
		})
	)
	this.account_select.on("change", function() {
		me.filters.account = this.value
		me.create_chart()
	});

	this.timespan_select.on("change", function() {
		me.filters.timespan = this.value
		me.create_chart()
	});

	this.timegrain_select.on("change", function() {
		me.filters.timegrain = this.value
		me.create_chart()
	});

	this.create_chart = function() {
		frappe.call({
			method: "frappe.core.page.dashboard.dashboard.get_data",
			args: {
				dashboard_name: "erpnext.accounts.dashboard.get",
				filters: this.filters,
			},
			callback: function(message) {
				const data = message.message
				var chart_args = {
					data: {
						datasets: data.datasets,
						labels: data.labels,
					},
					type: 'line',
				}
				new Chart('#dashboard-graph', chart_args)
			}
		})
	}

	this.create_chart()
}