#include<bits/stdc++.h>
using namespace std;
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;

template<typename T> using ordered_set =tree<T, null_type,less<T>, rb_tree_tag,tree_order_statistics_node_update>;
//order_of_key (k) : Number of items strictly smaller than k .
//find_by_order(k) : K-th element in a set (counting from zero).
template<typename T> using ordered_multiset = tree<T, null_type,less_equal<T>, rb_tree_tag,tree_order_statistics_node_update>;
//Erase -
//if(os.upper_bound(x)!=os.end())
//    os.erase(os.upper_bound(x));
//gp_hash_table

#define ll long long
#define pb push_back
#define mp make_pair
#define F first
#define S second
#define PI 3.1415926535897932384626
#define all(x) x.begin(),x.end()
#define endl '\n'
#define MOD 1000000007

void solve() {
    int n;
    cin>>n;
    vector<pair<int,int>>arr(n+1,{0,0});
    for(int i=1;i<=n;i++)
    {
        int x;
        cin>>x;
        arr[i].F=x;
        arr[i].S=i%2;
    }
    sort(arr.begin()+1,arr.end());
    int ch=arr[1].S;
    for(int i=1;i<=n;i+=2)
    {
        if(ch!=arr[i].S)
        {
            cout<<"NO"<<endl;return;
        }
    }
    ch=arr[2].S;
    for(int i=2;i<=n;i+=2)
    {
        if(ch!=arr[i].S)
        {
            cout<<"NO"<<endl;return;
        }
    }
    cout<<"YES"<<endl;

}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int t = 1;
    cin >> t;
    while(t--) {
        solve();
    }
    return 0;
}